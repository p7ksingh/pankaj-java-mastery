import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, ScanCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const db = DynamoDBDocumentClient.from(client);

const QUESTIONS_TABLE = process.env.QUESTIONS_TABLE || "javabypankaj-questions";
const SUBSCRIBERS_TABLE = process.env.SUBSCRIBERS_TABLE || "javabypankaj-subscribers";

const ALLOWED_ORIGINS = [
  "https://www.javabypankaj.live",
  "https://javabypankaj.live",
];

function getCorsHeaders(event) {
  const origin = event.headers?.origin || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function respond(statusCode, body, event) {
  return {
    statusCode,
    headers: getCorsHeaders(event),
    body: JSON.stringify(body),
  };
}

function generateId() {
  return Date.now().toString() + "-" + Math.random().toString(36).slice(2, 8);
}

function parsePath(event) {
  return event.rawPath || event.path || "/";
}

function parseMethod(event) {
  return event.requestContext?.http?.method || event.httpMethod || "GET";
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch {
    return {};
  }
}

async function handlePostQuestion(event) {
  const body = parseBody(event);
  const question = (body.question || "").trim();

  if (question.length < 10) {
    return respond(400, { msg: "Question too short (min 10 characters)" }, event);
  }

  if (question.length > 500) {
    return respond(400, { msg: "Question too long (max 500 characters)" }, event);
  }

  await db.send(new PutCommand({
    TableName: QUESTIONS_TABLE,
    Item: {
      id: generateId(),
      question,
      company: (body.company || "").trim(),
      topic: (body.topic || "").trim(),
      name: (body.name || "").trim(),
      email: (body.email || "").trim(),
      time: new Date().toISOString(),
      status: "pending",
    },
  }));

  return respond(200, { msg: "Submitted!" }, event);
}

async function handleGetQuestions(event) {
  const result = await db.send(new ScanCommand({
    TableName: QUESTIONS_TABLE,
    FilterExpression: "#s = :approved",
    ExpressionAttributeNames: { "#s": "status" },
    ExpressionAttributeValues: { ":approved": "approved" },
  }));

  const questions = (result.Items || []).sort(
    (a, b) => (b.time || "").localeCompare(a.time || "")
  );

  return respond(200, questions, event);
}

async function handlePostSubscribe(event) {
  const body = parseBody(event);
  const email = (body.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return respond(400, { msg: "Invalid email" }, event);
  }

  await db.send(new PutCommand({
    TableName: SUBSCRIBERS_TABLE,
    Item: {
      email,
      source: body.source || "website",
      time: new Date().toISOString(),
    },
  }));

  return respond(200, { msg: "Subscribed!" }, event);
}

async function handleDeleteSubscribe(event) {
  const body = parseBody(event);
  const params = event.queryStringParameters || {};
  const email = (body.email || params.email || "").trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return respond(400, { msg: "Invalid email" }, event);
  }

  await db.send(new DeleteCommand({
    TableName: SUBSCRIBERS_TABLE,
    Key: { email },
  }));

  return respond(200, { msg: "Unsubscribed successfully. You will no longer receive emails." }, event);
}

export const handler = async (event) => {
  const method = parseMethod(event);
  const path = parsePath(event);

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: getCorsHeaders(event) };
  }

  try {
    if (method === "POST" && path.includes("/questions")) {
      return await handlePostQuestion(event);
    }

    if (method === "GET" && path.includes("/questions")) {
      return await handleGetQuestions(event);
    }

    if (method === "POST" && path.includes("/subscribe")) {
      return await handlePostSubscribe(event);
    }

    if (method === "DELETE" && path.includes("/subscribe")) {
      return await handleDeleteSubscribe(event);
    }

    return respond(404, { msg: "Not found" }, event);
  } catch (err) {
    console.error("Lambda error:", err);
    return respond(500, { msg: "Internal error" }, event);
  }
};

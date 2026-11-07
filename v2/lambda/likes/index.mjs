import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand, BatchGetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-2" });
const db = DynamoDBDocumentClient.from(client);
const LIKES_TABLE = "javabypankaj-like";

const ALLOWED_ORIGINS = [
  "https://www.javabypankaj.live",
  "https://javabypankaj.live",
];

function cors(event) {
  const origin = event.headers?.origin || "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : "",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function respond(code, body, event) {
  return { statusCode: code, headers: cors(event), body: JSON.stringify(body) };
}

function parseBody(event) {
  try { return JSON.parse(event.body || "{}"); } catch { return {}; }
}

/** Validate questionId: 1-100 chars, alphanumeric + hyphens + underscores only */
function validateQuestionId(id) {
  if (!id || typeof id !== "string") return null;
  const trimmed = id.trim();
  if (trimmed.length === 0 || trimmed.length > 100) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) return null;
  return trimmed;
}

export const handler = async (event) => {
  const method = event.requestContext?.http?.method || event.httpMethod || "GET";

  if (method === "OPTIONS") {
    return { statusCode: 204, headers: cors(event) };
  }

  try {
    // POST /likes — increment like count
    if (method === "POST") {
      const { questionId: rawId } = parseBody(event);
      const questionId = validateQuestionId(rawId);
      if (!questionId) {
        return respond(400, { msg: "Invalid questionId (1-100 chars, alphanumeric/hyphens only)" }, event);
      }

      const result = await db.send(new UpdateCommand({
        TableName: LIKES_TABLE,
        Key: { questionId },
        UpdateExpression: "ADD likeCount :inc",
        ExpressionAttributeValues: { ":inc": 1 },
        ReturnValues: "ALL_NEW",
      }));

      return respond(200, {
        questionId,
        likeCount: result.Attributes?.likeCount || 1,
      }, event);
    }

    // DELETE /likes — decrement like count (min 0)
    if (method === "DELETE") {
      const body = parseBody(event);
      const params = event.queryStringParameters || {};
      const questionId = validateQuestionId(body.questionId || params.questionId);

      if (!questionId) {
        return respond(400, { msg: "Invalid questionId" }, event);
      }

      try {
        const result = await db.send(new UpdateCommand({
          TableName: LIKES_TABLE,
          Key: { questionId },
          UpdateExpression: "ADD likeCount :dec",
          ConditionExpression: "attribute_exists(questionId) AND likeCount > :zero",
          ExpressionAttributeValues: { ":dec": -1, ":zero": 0 },
          ReturnValues: "ALL_NEW",
        }));

        return respond(200, {
          questionId,
          likeCount: result.Attributes?.likeCount || 0,
        }, event);
      } catch (err) {
        if (err.name === "ConditionalCheckFailedException") {
          return respond(200, { questionId, likeCount: 0 }, event);
        }
        throw err;
      }
    }

    // GET /likes — two modes:
    //   ?top=50       → top-N most liked (for Popular page)
    //   ?ids=Q1,Q2    → batch fetch counts
    if (method === "GET") {
      const params = event.queryStringParameters || {};

      // Mode 1: Top-liked questions
      if (params.top) {
        const limit = Math.min(Math.max(parseInt(params.top, 10) || 50, 1), 200);
        const result = await db.send(new ScanCommand({
          TableName: LIKES_TABLE,
          ProjectionExpression: "questionId, likeCount",
          FilterExpression: "likeCount > :zero",
          ExpressionAttributeValues: { ":zero": 0 },
        }));

        const items = (result.Items || [])
          .sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0))
          .slice(0, limit)
          .map((item) => ({
            questionId: item.questionId,
            likeCount: item.likeCount || 0,
          }));

        return respond(200, { items, total: result.Items?.length || 0 }, event);
      }

      // Mode 2: Batch fetch by IDs
      const idsParam = (params.ids || "").trim();

      if (!idsParam) {
        return respond(200, { counts: {} }, event);
      }

      const ids = idsParam.split(",").map((s) => s.trim()).filter((s) => /^[a-zA-Z0-9_-]+$/.test(s) && s.length <= 100).slice(0, 100);

      if (ids.length === 0) {
        return respond(200, { counts: {} }, event);
      }

      const result = await db.send(new BatchGetCommand({
        RequestItems: {
          [LIKES_TABLE]: {
            Keys: ids.map((questionId) => ({ questionId })),
            ProjectionExpression: "questionId, likeCount",
          },
        },
      }));

      const counts = {};
      for (const id of ids) {
        counts[id] = 0;
      }
      for (const item of (result.Responses?.[LIKES_TABLE] || [])) {
        counts[item.questionId] = item.likeCount || 0;
      }

      return respond(200, { counts }, event);
    }

    return respond(404, { msg: "Not found" }, event);
  } catch (err) {
    console.error("Likes error:", err);
    return respond(500, { msg: "Internal error" }, event);
  }
};

# API Contract

This document defines the REST API interface between the Next.js frontend and the Spring Boot backend (Phase 3). The frontend is built against these interfaces from day one — when Spring Boot is ready, it implements these exact endpoints.

## Base URL
- Phase 1 (static): N/A — data from JSON files at build time
- Phase 3 (API): `https://api.javabypankaj.live/api/v1`

## Authentication
- Phase 1: No auth (static site)
- Phase 3: JWT tokens in `Authorization: Bearer <token>` header
- Public endpoints don't need auth. User-specific endpoints (progress, bookmarks sync) need auth.

## Rate Limiting
- All endpoints: 100 requests/minute per IP
- Submit endpoints: 5 requests/hour per IP
- Search endpoint: 30 requests/minute per IP
- Response headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

## Common Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 155,
    "page": 1,
    "pageSize": 50,
    "timestamp": "2026-11-02T10:00:00Z"
  },
  "error": null
}
```

## Error Response Format
```json
{
  "success": false,
  "data": null,
  "meta": null,
  "error": {
    "code": "NOT_FOUND",
    "message": "Chapter 'core-javaa' not found",
    "details": null
  }
}
```

---

## Endpoints

### 1. Chapters

#### GET /api/v1/chapters
Returns all chapters with summary info.
```json
{
  "success": true,
  "data": [
    {
      "number": 1,
      "slug": "core-java",
      "title": "Core Java",
      "topicCount": 76,
      "questionCount": 155,
      "description": "Fundamentals of Java programming..."
    }
  ]
}
```

#### GET /api/v1/chapters/{slug}
Returns one chapter with its topics.
```json
{
  "success": true,
  "data": {
    "number": 1,
    "slug": "core-java",
    "title": "Core Java",
    "topics": [
      {
        "index": 0,
        "slug": "jdk-jre-jvm",
        "title": "What is the difference between the JDK",
        "questionCount": 1,
        "questionRange": "Q1"
      }
    ]
  }
}
```

### 2. Questions

#### GET /api/v1/chapters/{chapterSlug}/topics/{topicSlug}/questions
Returns questions for a topic.

#### GET /api/v1/questions/{id}
Returns one question by ID (e.g., Q1).

#### GET /api/v1/questions/by-slug/{chapterSlug}/{topicSlug}/{questionSlug}
Returns one question by URL slugs.
```json
{
  "success": true,
  "data": {
    "id": "Q1",
    "slug": "jdk-jre-jvm-difference",
    "question": "What is the difference between the JDK, the JRE, and the JVM?",
    "chapter": { "number": 1, "slug": "core-java", "title": "Core Java" },
    "topic": { "index": 0, "slug": "jdk-jre-jvm", "title": "..." },
    "sections": [
      {
        "type": "definition",
        "emoji": "📌",
        "title": "DEFINITION",
        "content": "The JVM (Java Virtual Machine) is the runtime engine..."
      },
      {
        "type": "code",
        "emoji": "💻",
        "title": "CODE EXAMPLE",
        "language": "java",
        "code": "public class Main { ... }",
        "explanation": "..."
      }
    ],
    "prev": { "slug": "...", "title": "..." },
    "next": { "slug": "...", "title": "..." },
    "related": [ ... ]
  }
}
```

### 3. Search

#### GET /api/v1/search?q={query}&type={interview|learn|all}&limit={50}
```json
{
  "success": true,
  "data": {
    "query": "hashmap",
    "results": [
      {
        "type": "interview",
        "id": "Q148",
        "slug": "core-java/collections/hashmap-vs-hashtable",
        "title": "HashMap vs Hashtable vs ConcurrentHashMap",
        "chapter": "Collections",
        "highlight": "...<mark>HashMap</mark> vs Hashtable..."
      }
    ]
  },
  "meta": { "total": 50 }
}
```

### 4. Learn (Phase 4)

#### GET /api/v1/learn/categories
#### GET /api/v1/learn/{categorySlug}
#### GET /api/v1/learn/{categorySlug}/{topicSlug}

### 5. Submissions

#### POST /api/v1/submissions/question
```json
// Request
{ "question": "...", "email": "...", "company": "...", "topic": "...", "name": "..." }
// Response
{ "success": true, "data": { "id": "sub_123", "message": "Submitted!" } }
```

#### POST /api/v1/submissions/subscribe
```json
// Request
{ "email": "user@example.com" }
// Response
{ "success": true, "data": { "message": "Subscribed!" } }
```

#### GET /api/v1/submissions/questions (public, no emails)
```json
{
  "success": true,
  "data": [
    { "question": "...", "company": "Infosys", "topic": "Core Java", "name": "Rahul", "date": "2026-11-01" }
  ]
}
```

### 6. User (Phase 3 — authenticated)

#### GET /api/v1/users/me/progress
#### PUT /api/v1/users/me/progress/{questionId}
#### GET /api/v1/users/me/bookmarks
#### PUT /api/v1/users/me/bookmarks/{questionId}
#### GET /api/v1/users/me/notes/{questionId}
#### PUT /api/v1/users/me/notes/{questionId}

---

## Spring Boot Implementation Notes

When building the Java backend:
1. Use Spring Boot 3.x with Java 17+
2. Controller → Service → Repository layers
3. JPA/Hibernate for PostgreSQL
4. Spring Security with JWT for auth endpoints
5. `@RateLimiter` from Resilience4j for throttling
6. `@Valid` with Bean Validation for input validation
7. OpenAPI/Swagger for documentation
8. The JSON response format above must match exactly — the frontend depends on it

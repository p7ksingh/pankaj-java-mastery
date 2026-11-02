# High Level Design (HLD)

## 1. System Context

```
┌─────────────────────────────────────────────────────────────────┐
│                        USERS                                     │
│  Browser (Desktop/Mobile)  │  Googlebot  │  Social Media Crawlers│
└─────────────┬──────────────┴──────┬──────┴───────────┬──────────┘
              │ HTTPS                │ HTTPS             │ HTTPS
              ▼                      ▼                   ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CDN LAYER (CloudFront)                         │
│  Edge caching │ HTTPS termination │ Security headers │ WAF       │
│  Rate limiting │ Geo-routing │ Compression │ DDoS protection     │
└─────────────┬───────────────────────────────────────────────────┘
              │
    ┌─────────┴─────────┐
    ▼                   ▼
┌──────────┐    ┌──────────────┐
│ S3 Bucket│    │ API Gateway  │
│ (Static) │    │ (REST API)   │
│          │    │              │
│ HTML/CSS │    │ Rate limited │
│ JS/Images│    │ Throttled    │
│ JSON data│    │ Validated    │
└──────────┘    └──────┬───────┘
                       │
              ┌────────┴────────┐
              ▼                 ▼
       ┌────────────┐   ┌────────────┐
       │ Lambda     │   │ Lambda     │
       │ subscribe  │   │ questions  │
       └────────────┘   └────────────┘
              │                 │
              ▼                 ▼
       ┌────────────────────────────┐
       │ GitHub Repo (javabypankaj- │
       │ logs) — JSON storage       │
       └────────────────────────────┘

    PHASE 3 (Future):
    ┌─────────────────────────────────────────┐
    │         Spring Boot API Server           │
    │  ┌──────────┐  ┌──────────┐  ┌───────┐ │
    │  │ Auth     │  │ Content  │  │ Admin │ │
    │  │ Service  │  │ Service  │  │ Panel │ │
    │  └────┬─────┘  └────┬─────┘  └───┬───┘ │
    │       └──────────────┼────────────┘     │
    │                      ▼                  │
    │              ┌──────────────┐           │
    │              │ PostgreSQL   │           │
    │              │ (Users, Data)│           │
    │              └──────────────┘           │
    └─────────────────────────────────────────┘
```

## 2. Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION                        │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  CONFIGURATION LAYER                     │ │
│  │  AppConfig │ FeatureFlags │ Environment │ API Endpoints  │ │
│  └──────────────────────┬──────────────────────────────────┘ │
│                         │                                     │
│  ┌──────────────────────┴──────────────────────────────────┐ │
│  │                  PRESENTATION LAYER                      │ │
│  │  Pages (App Router) │ Layouts │ Components │ Styles      │ │
│  └──────────────────────┬──────────────────────────────────┘ │
│                         │ uses                                │
│  ┌──────────────────────┴──────────────────────────────────┐ │
│  │                  APPLICATION LAYER                       │ │
│  │  Custom Hooks │ Event Handlers │ Client State            │ │
│  └──────────────────────┬──────────────────────────────────┘ │
│                         │ depends on                          │
│  ┌──────────────────────┴──────────────────────────────────┐ │
│  │                  DOMAIN LAYER                            │ │
│  │  Types │ Interfaces │ Business Rules │ Validation        │ │
│  └──────────────────────┬──────────────────────────────────┘ │
│                         │ implements                          │
│  ┌──────────────────────┴──────────────────────────────────┐ │
│  │              DATA ACCESS LAYER (Repository Pattern)      │ │
│  │                                                          │ │
│  │  ┌─────────────────┐        ┌──────────────────┐       │ │
│  │  │ IContentRepo    │◄───────│ DataRepoFactory   │       │ │
│  │  │ (Interface)     │        │ (reads config)    │       │ │
│  │  └───────┬─────────┘        └──────────────────┘       │ │
│  │          │ implements                                    │ │
│  │  ┌───────┴────────────────────────┐                     │ │
│  │  │                                │                     │ │
│  │  ▼                                ▼                     │ │
│  │  ┌──────────────┐   ┌───────────────────┐              │ │
│  │  │ JSONFileRepo │   │ SpringBootAPIRepo │              │ │
│  │  │ (Phase 1)    │   │ (Phase 3)         │              │ │
│  │  │ reads .json  │   │ calls REST API    │              │ │
│  │  └──────────────┘   └───────────────────┘              │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 3. Key Design Decisions for Scalability

| Concern | Solution |
|---|---|
| **No hardcoding** | All values from `AppConfig`. Site name, URLs, API endpoints, GA ID, limits — everything configurable |
| **Data source swap** | Repository pattern with interface. JSON today, Spring Boot API tomorrow. One config change |
| **Rate limiting** | CloudFront + API Gateway throttling. Client-side debounce on search/submit |
| **Security headers** | CSP, HSTS, X-Frame-Options via CloudFront response headers policy |
| **Input validation** | Client-side + server-side (Lambda / Spring Boot). Never trust client |
| **SEO** | Static HTML with unique meta per page. Structured data. Auto-generated sitemap |
| **Caching** | CDN edge cache (CloudFront). Browser cache headers. Service Worker (PWA later) |
| **Error handling** | Error boundaries in React. Graceful degradation. No blank screens |
| **Monitoring** | Core Web Vitals. Error tracking. Analytics events |
| **Accessibility** | WCAG 2.1 AA. Keyboard nav. Screen reader. Focus management |
| **i18n ready** | All UI strings from config/constants. Not hardcoded in components |

## 4. Security Architecture

```
Request Flow with Security:

User Request
    │
    ▼
CloudFront ──→ WAF Rules (optional)
    │           ├── Rate limit: 1000 req/min per IP
    │           ├── Block known bad IPs
    │           ├── SQL injection patterns
    │           └── XSS patterns
    │
    ├── Static content ──→ S3 (no security risk, read-only)
    │
    └── API calls ──→ API Gateway
                        ├── Throttle: 100 req/min per IP
                        ├── Request validation (JSON schema)
                        ├── CORS: only www.javabypankaj.live
                        └── Lambda
                              ├── Input sanitization
                              ├── Output encoding
                              └── Least-privilege IAM role
```

## 5. Data Architecture

```
PHASE 1 (Static JSON):
  Build Time: JSON files → Next.js SSG → Static HTML pages
  Runtime: S3 serves pre-built HTML. No data fetching.

PHASE 3 (Spring Boot API):
  Build Time: Next.js builds page shells with loading states
  Runtime: Client fetches data from Spring Boot API
  
  Spring Boot API Structure:
  ┌──────────────────────────────────────────┐
  │  Controller Layer (REST endpoints)        │
  │  ├── /api/v1/chapters                    │
  │  ├── /api/v1/chapters/{slug}             │
  │  ├── /api/v1/chapters/{slug}/questions   │
  │  ├── /api/v1/questions/{slug}            │
  │  ├── /api/v1/search?q=...               │
  │  ├── /api/v1/learn/categories            │
  │  ├── /api/v1/learn/{category}/{topic}    │
  │  ├── /api/v1/auth/login                  │
  │  └── /api/v1/users/{id}/progress         │
  │                                           │
  │  Service Layer (business logic)           │
  │  ├── ChapterService                      │
  │  ├── QuestionService                     │
  │  ├── SearchService                       │
  │  ├── TutorialService                     │
  │  ├── AuthService                         │
  │  └── UserProgressService                 │
  │                                           │
  │  Repository Layer (data access)           │
  │  ├── ChapterRepository (JPA)             │
  │  ├── QuestionRepository (JPA)            │
  │  └── UserRepository (JPA)               │
  │                                           │
  │  Database: PostgreSQL                     │
  └──────────────────────────────────────────┘
```

## 6. Deployment Architecture

```
GitHub (p7ksingh/pankaj-java-mastery)
    │
    ├── Push to dev ──→ No deploy (development only)
    │
    ├── PR: dev → qa ──→ Preview deploy (optional S3 staging bucket)
    │
    └── PR: qa → main ──→ GitHub Actions
                              │
                              ├── npm run build (next build && next export)
                              ├── npm test (all tests must pass)
                              ├── Lighthouse audit (must score 90+)
                              │
                              ├── aws s3 sync out/ s3://javabypankaj
                              └── aws cloudfront create-invalidation
```

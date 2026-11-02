# Learn Section — Design Patterns

## Source Material
- Location: `/Users/PASINGH2501/Downloads/Design_Patterns_Notes/`
- Format: 69 PNG pages (handwritten/typed notes) + 1 HTML reference file (4,126 lines)
- Course: NTDP614 — NareshIT Java Design Patterns
- Already extracted: `Design_Patterns_Reference.html` has all content in HTML

## 21 Design Patterns (organized by category)

### GOF — Creational Patterns (5)
| # | Pattern | Pages | Key Concepts |
|---|---|---|---|
| 2 | Singleton | 12 | Lazy init, eager init, thread-safe, double-checked locking, enum singleton, Bill Pugh |
| 3 | Factory / Factory Method | 4 | Factory method, product interface, concrete factories |
| 4 | Abstract Factory | 1 | Factory of factories, family of related objects |
| 6 | Builder | 1 | Step-by-step construction, fluent API |
| 12 | Prototype | 3 | Cloneable, shallow vs deep copy |

### GOF — Structural Patterns (4)
| # | Pattern | Pages | Key Concepts |
|---|---|---|---|
| 8 | Adapter | 2 | Class adapter, object adapter, interface conversion |
| 9 | Decorator / Wrapper | 2 | Dynamic behavior, composition over inheritance |
| 10 | Flyweight | 2 | Shared objects, intrinsic vs extrinsic state |
| 11 | Proxy | 4 | Virtual proxy, protection proxy, remote proxy |

### GOF — Behavioral Patterns (2)
| # | Pattern | Pages | Key Concepts |
|---|---|---|---|
| 5 | Template Method | 2 | Algorithm skeleton, hook methods |
| 7 | Strategy | 3 | Interchangeable algorithms, runtime selection |

### JEE Patterns (8)
| # | Pattern | Pages | Key Concepts |
|---|---|---|---|
| 13 | DAO | 4 | Data access object, CRUD abstraction |
| 14 | Business Delegate | 5 | Service lookup, decoupling presentation from business |
| 15 | Service Locator | 6 | Registry, caching, JNDI lookup |
| 16 | Session Facade | 1 | Coarse-grained interface, transaction boundary |
| 17 | Message Facade | 1 | Asynchronous processing, JMS |
| 18 | Composite View | 1 | Reusable view components, includes |
| 19 | Intercepting Filter / View Helper | 4 | Filter chain, pre/post processing |
| 20 | Front Controller | 3 | Central entry point, dispatcher |

### Microservices Patterns (1 section, multiple patterns)
| # | Pattern | Pages | Key Concepts |
|---|---|---|---|
| 21 | Microservices Patterns | 5 | SAGA, Event Sourcing, CQRS, API Gateway |

## Content Conversion Plan
Each pattern will be converted to a JSON file following a tutorial format:

```json
{
  "slug": "singleton-pattern",
  "title": "Singleton Design Pattern in Java",
  "category": "design-patterns",
  "subcategory": "creational",
  "difficulty": "Medium",
  "readingTime": 15,
  "sections": [
    {
      "type": "concept",
      "title": "What is Singleton Pattern?",
      "content": "..."
    },
    {
      "type": "problem",
      "title": "When to Use It",
      "content": "..."
    },
    {
      "type": "solution",
      "title": "Implementation",
      "content": "..."
    },
    {
      "type": "code",
      "title": "Basic Singleton",
      "language": "java",
      "code": "...",
      "explanation": "..."
    },
    {
      "type": "code",
      "title": "Thread-Safe Singleton",
      "language": "java",
      "code": "...",
      "explanation": "..."
    },
    {
      "type": "diagram",
      "title": "UML Class Diagram",
      "content": "..."
    },
    {
      "type": "realworld",
      "title": "Real-World Example — Printer in an Office",
      "content": "..."
    },
    {
      "type": "pitfalls",
      "title": "Common Mistakes",
      "content": "..."
    },
    {
      "type": "interview",
      "title": "Interview Questions on Singleton",
      "content": "..."
    }
  ],
  "relatedPatterns": ["factory-method", "abstract-factory"],
  "tags": ["creational", "gof", "thread-safety", "lazy-initialization"]
}
```

## Learn Page Layout (vs Interview Page)

| Element | Interview Page | Learn Page |
|---|---|---|
| Header | Question title + Q number | Pattern name + category badge |
| Quick answer | 2-3 line summary | Concept definition |
| Body | 12 SKILL sections | Sections: concept → problem → solution → code → diagram |
| Code | 1-2 examples, banking domain | Multiple examples, progressively complex |
| Diagrams | ASCII or simple | UML, sequence, flowchart |
| Navigation | Prev/Next question | Prev/Next pattern, related patterns sidebar |
| Sidebar | Related questions, chapter nav | Related patterns, category nav, difficulty |
| SEO | FAQ schema | Course/Article schema |

## Data Location
```
v2/data/
├── interview/              ← Existing 28 chapter JSON files
│   ├── ch01.json
│   └── ... ch28.json
└── learn/                  ← New learning content
    └── design-patterns/
        ├── _meta.json      ← Category metadata (title, description, order)
        ├── singleton.json
        ├── factory-method.json
        ├── abstract-factory.json
        └── ... (21 files)
```

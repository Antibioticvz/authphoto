# Backend Setup - Implementation Plan

**Feature:** 001-backend-setup
**Phase:** PHASE 1 - Backend Infrastructure
**Duration:** 2 days
**Status:** In Progress

---

## Overview

This feature implements the initial backend infrastructure for AuthPhoto, including NestJS project setup, shared services, utilities, and development environment configuration.

---

## Tech Stack

| Component | Technology | Version |
|-----------|------------|---------|
| **Runtime** | Node.js | v18+ |
| **Framework** | NestJS | v10+ |
| **Language** | TypeScript | v5+ |
| **Package Manager** | npm | v9+ |
| **Testing** | Jest | v29+ |
| **Linting** | ESLint | v8+ |
| **Formatting** | Prettier | v3+ |
| **Containerization** | Docker | latest |

---

## Architecture

### Module Structure

```
backend/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── app.module.ts              # Root module
│   ├── app.controller.ts          # Health check endpoint
│   ├── app.service.ts             # App service
│   ├── shared/                    # Shared utilities
│   │   ├── shared.module.ts
│   │   ├── services/
│   │   │   ├── crypto.service.ts  # SHA-256, UUID, nonce generation
│   │   │   ├── logger.service.ts  # Structured logging
│   │   │   └── cache.service.ts   # In-memory cache with TTL
│   │   └── types/
│   │       └── shared.types.ts
│   ├── common/                    # Common utilities
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── transform.interceptor.ts
│   │   │   └── performance.interceptor.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── decorators/
│   │       └── api-response.decorator.ts
│   └── config/
│       ├── configuration.ts
│       ├── database.config.ts
│       └── logger.config.ts
├── test/                          # E2E tests
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── nest-cli.json
└── package.json
```

---

## Configuration

### Environment Variables

```bash
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api/v1

# Logging
LOG_LEVEL=debug

# Cache
CACHE_TTL=30

# CORS
CORS_ORIGIN=http://localhost:5173
```

---

## Development Scripts

```json
{
  "scripts": {
    "dev": "nest start --watch",
    "build": "nest build",
    "start": "node dist/main",
    "start:prod": "NODE_ENV=production node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\"",
    "lint:fix": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage"
  }
}
```

---

## Testing Strategy

### Unit Tests

- **Coverage target:** 80%+
- **Test framework:** Jest
- **Location:** `src/**/__tests__/*.spec.ts`
- **Run:** `npm test`

### Test Structure

```typescript
describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should generate SHA-256 hash', () => {
    const hash = service.generateHash('test');
    expect(hash).toHaveLength(64);
  });
});
```

---

## Docker Configuration

### Dockerfile

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
    volumes:
      - ./backend/src:/app/src
      - ./backend/photos:/app/photos
    command: npm run dev
```

---

## Quality Gates

### Pre-commit Checks

- [x] TypeScript strict mode enabled
- [x] ESLint passes without errors
- [x] Prettier formatting applied
- [x] No console.log statements (use logger)
- [x] All tests passing

### Code Review Checklist

- [x] Code follows NestJS best practices
- [x] Services use dependency injection
- [x] All functions are typed
- [x] Error handling implemented
- [x] Unit tests written and passing
- [x] Documentation updated

---

## Implementation Order

1. **Project Initialization** (Task 1.1.1)
   - Initialize NestJS project
   - Configure TypeScript strict mode
   - Setup ESLint and Prettier
   - Configure Docker
   - Create health check endpoint

2. **Shared Services** (Task 1.1.2)
   - Implement CryptoService
   - Implement LoggerService
   - Implement CacheService
   - Setup global exception filter
   - Setup response interceptor

---

## Success Criteria

- [x] `npm run dev` starts server on localhost:3000
- [x] TypeScript strict mode enabled
- [x] ESLint passing without warnings
- [x] Docker image builds successfully
- [x] Health check endpoint works: GET /api/v1/health
- [x] All 4 shared services fully typed
- [x] Unit tests: 80%+ coverage
- [x] Global error handling returns consistent format

---

## References

- [TASK_BREAKDOWN.md](../TASK_BREAKDOWN.md) - Full task list
- [TECHNICAL_SPECIFICATION.md](../TECHNICAL_SPECIFICATION.md) - System architecture
- [DEVELOPMENT_GUIDE.md](../DEVELOPMENT_GUIDE.md) - Development guidelines
- [BEST_PRACTICES_CHECKLIST.md](../BEST_PRACTICES_CHECKLIST.md) - Code quality standards

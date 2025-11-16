# Implementation Guide: 001-backend-setup

**Current Status:** Partially Complete  
**Next Steps:** Complete remaining tasks and validate constitution compliance

---

## 📊 Current Implementation Status

### ✅ Already Completed

Based on the existing codebase:

1. ✅ **SETUP-1**: NestJS project initialized
   - Package.json configured
   - TypeScript configured
   - Basic modules created

2. ✅ **SETUP-2**: ESLint and Prettier configured
   - `.eslintrc.json` exists
   - `.prettierrc` exists
   - Lint scripts in package.json

3. ✅ **SETUP-3**: Environment configuration started
   - `.env.example` exists
   - Config module structure in place

4. ✅ **CORE-1**: Shared module structure created
   - `src/shared/` directory exists
   - Module structure in place

5. ✅ **CORE-5**: Common utilities partially created
   - `src/common/` directory exists
   - Filters, interceptors, pipes structure present

### 🔄 Needs Completion

According to `tasks.md`, you need to complete:

1. 🔄 **SETUP-4**: Docker configuration
2. 🔄 **SETUP-5**: Health check endpoint (verify it works)
3. 🔄 **TEST-1**: Testing infrastructure setup
4. 🔄 **TEST-2**: Test fixtures
5. 🔄 **CORE-2**: CryptoService implementation + tests
6. 🔄 **CORE-3**: LoggerService implementation + tests
7. 🔄 **CORE-4**: CacheService implementation + tests
8. 🔄 **INTEGRATION-1**: Integrate all services
9. 🔄 **INTEGRATION-2**: Global configuration
10. 🔄 **POLISH-1**: Documentation and final testing

---

## 🚀 Implementation Roadmap

### Phase 1: Quick Wins (30 minutes)

**Goal:** Get tests running and validate current setup

```bash
# 1. Check current test setup
cd backend
npm test

# 2. Check linting
npm run lint

# 3. Check if server runs
npm run start:dev

# 4. Test health endpoint
curl http://localhost:3000/api/v1/health
```

### Phase 2: Core Services (2-3 hours)

**Goal:** Implement and test the three core services

#### Task: Implement CryptoService

**TDD Approach:**

1. **Write tests first** (15 min):
```bash
# Create test file
mkdir -p src/shared/services/__tests__
touch src/shared/services/__tests__/crypto.service.spec.ts
```

```typescript
// crypto.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CryptoService } from '../crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoService],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateHash', () => {
    it('should generate SHA-256 hash', () => {
      const hash = service.generateHash('test');
      expect(hash).toHaveLength(64);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);
    });

    it('should generate different hashes for different inputs', () => {
      const hash1 = service.generateHash('test1');
      const hash2 = service.generateHash('test2');
      expect(hash1).not.toBe(hash2);
    });

    it('should generate same hash for same input', () => {
      const hash1 = service.generateHash('test');
      const hash2 = service.generateHash('test');
      expect(hash1).toBe(hash2);
    });
  });

  describe('generateUUID', () => {
    it('should generate valid UUID v4', () => {
      const uuid = service.generateUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = service.generateUUID();
      const uuid2 = service.generateUUID();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('generateNonce', () => {
    it('should generate nonce of specified length', () => {
      const nonce = service.generateNonce(16);
      expect(nonce).toHaveLength(32); // hex string is 2x length
    });

    it('should generate unique nonces', () => {
      const nonce1 = service.generateNonce(16);
      const nonce2 = service.generateNonce(16);
      expect(nonce1).not.toBe(nonce2);
    });
  });
});
```

2. **Run tests and see them fail** (2 min):
```bash
npm test crypto.service
```

3. **Implement service** (20 min):
```bash
touch src/shared/services/crypto.service.ts
```

```typescript
// crypto.service.ts
import { Injectable } from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CryptoService {
  /**
   * Generate SHA-256 hash
   * @param data - Input string to hash
   * @returns Hex-encoded hash string (64 characters)
   */
  generateHash(data: string): string {
    return createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generate UUID v4
   * @returns UUID string
   */
  generateUUID(): string {
    return uuidv4();
  }

  /**
   * Generate cryptographically secure random nonce
   * @param length - Byte length of nonce
   * @returns Hex-encoded nonce string
   */
  generateNonce(length: number): string {
    return randomBytes(length).toString('hex');
  }
}
```

4. **Install dependencies**:
```bash
npm install uuid
npm install --save-dev @types/uuid
```

5. **Run tests and see them pass** (2 min):
```bash
npm test crypto.service
```

6. **Check coverage**:
```bash
npm run test:cov -- crypto.service
```

#### Task: Implement CacheService

Follow same TDD approach for CacheService with TTL support.

#### Task: Implement LoggerService

Follow same TDD approach for LoggerService with structured logging.

### Phase 3: Integration (30 minutes)

**Goal:** Wire everything together

1. **Update SharedModule**:
```typescript
// shared.module.ts
import { Module, Global } from '@nestjs/common';
import { CryptoService } from './services/crypto.service';
import { CacheService } from './services/cache.service';
import { LoggerService } from './services/logger.service';

@Global()
@Module({
  providers: [CryptoService, CacheService, LoggerService],
  exports: [CryptoService, CacheService, LoggerService],
})
export class SharedModule {}
```

2. **Import in AppModule**:
```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './shared/shared.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

3. **Test injection in health endpoint**:
```typescript
// app.controller.ts
import { Controller, Get } from '@nestjs/common';
import { CryptoService } from './shared/services/crypto.service';

@Controller()
export class AppController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      testHash: this.cryptoService.generateHash('health-check'),
    };
  }
}
```

### Phase 4: Docker (30 minutes)

**Goal:** Containerize the application

Create `backend/Dockerfile`:
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

Create `backend/docker-compose.yml`:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - PORT=3000
    volumes:
      - ./src:/app/src
    command: npm run start:dev
```

Test:
```bash
docker-compose up
```

### Phase 5: Polish (30 minutes)

**Goal:** Documentation, final tests, constitution compliance

1. **Run full test suite**:
```bash
npm run test:cov
```

2. **Verify coverage ≥80%**:
```bash
# Check coverage report in terminal
# Should see overall coverage >= 80%
```

3. **Fix linting issues**:
```bash
npm run lint:fix
npm run format
```

4. **Verify health check**:
```bash
curl http://localhost:3000/api/v1/health
```

5. **Update documentation**:
   - Add JSDoc comments to all services
   - Update README.md

---

## 🎯 Constitution Compliance Checklist

Before marking this feature complete, verify:

### ✅ Test-First Development

- [ ] All tests written before implementation
- [ ] Test coverage ≥80%
- [ ] All tests passing
- [ ] Tests run in CI/CD

### ✅ Type Safety

- [ ] TypeScript strict mode enabled
- [ ] No `any` types (check with: `grep -r "any" src/`)
- [ ] All functions fully typed
- [ ] Runtime validation for external inputs

### ✅ Security First

- [ ] No hardcoded credentials (check `.env.example`)
- [ ] Input validation in place
- [ ] Error messages don't leak sensitive info
- [ ] Dependencies scanned (run: `npm audit`)

### ✅ Code Quality

- [ ] ESLint passes without errors
- [ ] Prettier formatting applied
- [ ] Code reviewed (self-review at minimum)
- [ ] Modular architecture maintained
- [ ] No circular dependencies

---

## 📋 Daily Workflow

### Morning Routine

```bash
# 1. Check status
cd /Users/victor/Documents/projects/authphoto
./speckit status 001-backend-setup

# 2. Update branch
git pull origin 001-backend-setup

# 3. Start backend
cd backend
npm run start:dev

# 4. Run tests in watch mode
npm run test:watch
```

### Before Each Commit

```bash
# 1. Run tests
npm test

# 2. Check coverage
npm run test:cov

# 3. Lint and format
npm run lint:fix
npm run format

# 4. Commit with meaningful message
git add .
git commit -m "feat: implement CryptoService with full test coverage"
```

### End of Day

```bash
# 1. Push changes
git push origin 001-backend-setup

# 2. Update task status in tasks.md
# 3. Check overall progress
./speckit status 001-backend-setup
```

---

## 🆘 Common Issues & Solutions

### Issue: Tests failing

**Solution:**
```bash
# Clear cache
npm run test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Issue: Linter errors

**Solution:**
```bash
# Auto-fix most issues
npm run lint:fix

# Format code
npm run format
```

### Issue: TypeScript errors

**Solution:**
```bash
# Check TypeScript configuration
cat tsconfig.json

# Ensure strict mode is enabled
# Make sure all imports have types
```

### Issue: Coverage not meeting 80%

**Solution:**
```bash
# Generate detailed coverage report
npm run test:cov

# Look at coverage/lcov-report/index.html in browser
# Write tests for uncovered code
```

---

## 📊 Progress Tracking

Update this section as you complete tasks:

```
SETUP:
[✓] SETUP-1: Initialize NestJS
[✓] SETUP-2: ESLint/Prettier  
[✓] SETUP-3: Environment Config
[ ] SETUP-4: Docker
[ ] SETUP-5: Health Check (verify)

TESTS:
[ ] TEST-1: Test Infrastructure
[ ] TEST-2: Test Fixtures

CORE:
[✓] CORE-1: Shared Module Structure
[ ] CORE-2: CryptoService + Tests
[ ] CORE-3: LoggerService + Tests
[ ] CORE-4: CacheService + Tests
[~] CORE-5: Common Utilities (partially done)

INTEGRATION:
[ ] INTEGRATION-1: Integrate Services
[ ] INTEGRATION-2: Global Config

POLISH:
[ ] POLISH-1: Documentation & Final Testing

Current: 4/15 complete (27%)
```

---

## 🎓 Learning Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Jest Testing](https://jestjs.io/docs/getting-started)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Project Constitution](../../.specify/memory/constitution.md)

---

## 💡 Tips for Success

1. **Follow TDD strictly** - Write tests first, always
2. **Small commits** - Commit after each task completion
3. **Check coverage frequently** - Don't let it drop below 80%
4. **Use the constitution** - Reference it when making decisions
5. **Ask for help** - If stuck, review documentation or ask
6. **Test incrementally** - Don't wait until the end to test
7. **Keep it simple** - Don't over-engineer

---

**Remember:** Quality over speed. The constitution is non-negotiable!

Start with CryptoService, follow TDD, and build momentum! 🚀

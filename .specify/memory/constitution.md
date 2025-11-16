# AuthPhoto Constitution

## Core Principles

### I. Test-First Development (NON-NEGOTIABLE)

Every feature must follow the Test-Driven Development cycle: write tests first, get user/reviewer approval, see tests fail, implement, watch tests pass. All code changes require corresponding test coverage ≥80%. Automated testing is mandatory in CI/CD pipeline.

### II. Type Safety

Use TypeScript for all backend/frontend code with strict mode enabled. Full type coverage required (no `any` types without explicit justification). Runtime validation for all external inputs. Generated types from API contracts (OpenAPI/GraphQL).

### III. Security First

- All user input validated and sanitized before processing
- Authentication required for sensitive endpoints (JWT/OAuth2)
- Password hashing (bcrypt), secure session management
- HTTPS enforced in production
- Regular security audits and dependency scanning
- No hardcoded credentials; use environment variables

### IV. API-First Architecture

- RESTful API design with clear versioning (v1, v2, etc.)
- Consistent error responses (structured JSON with error codes)
- Request/response validation (JSON Schema or similar)
- API documentation (OpenAPI/Swagger) auto-generated
- Rate limiting, pagination, filtering standards

### V. Code Quality & Maintainability

- Linting (ESLint/Prettier) enforced pre-commit
- Code reviews required for all PRs (minimum 1 approval)
- Modular architecture: clear separation of concerns
- Documented public APIs and critical business logic
- No circular dependencies; dependency injection for testability
- Performance monitoring and optimization targets

## Development Requirements

### Database & State Management

- Use schema migrations (Prisma, Liquibase, etc.)
- Normalized schema, referential integrity constraints
- Audit logs for sensitive operations
- Transactional integrity for multi-step operations
- Connection pooling in production

### Logging & Observability

- Structured logging (JSON format) with levels (DEBUG, INFO, WARN, ERROR)
- Request tracing (correlation IDs)
- Error tracking with context (Sentry, DataDog, etc.)
- Performance metrics and monitoring
- Health check endpoints

### Deployment & Infrastructure

- Containerization (Docker) for consistency
- Infrastructure as Code (Terraform, CloudFormation)
- Environment parity (dev, staging, production)
- Automated deployment pipeline with stages
- Rollback capability, blue-green deployments preferred
- Secret management (HashiCorp Vault, cloud providers)

## Quality Gates

### Code Standards

- ✅ Unit tests pass (coverage ≥80%)
- ✅ Integration tests pass
- ✅ Linting passes (no warnings)
- ✅ Type checking passes
- ✅ Security scanning clean
- ✅ Performance benchmarks acceptable
- ✅ Code review approval

### Release Criteria

- All quality gates passing
- Breaking changes documented
- Migration scripts tested
- Deployment runbook prepared
- Rollback plan in place
- Monitoring/alerts configured

## Development Workflow

1. **Planning**: Define requirements, acceptance criteria, design discussion
2. **Implementation**: Create feature branch, write tests, implement, commit atomically
3. **Review**: PR with clear description, link to issue, self-review first
4. **Testing**: CI pipeline validates all gates, run manual smoke tests
5. **Merge**: Squash commits, add changelog entry
6. **Deploy**: Stage environment first (24h validation), then production

## Governance

- This Constitution is the source of truth for all development practices
- Violations require documented exceptions and approval
- Quarterly review and amendments with full team consensus
- All PRs/code reviews must verify compliance with these principles
- Complexity must be justified; when in doubt, choose simplicity
- Refer to implementation guidance documents for specific technologies

**Version**: 1.0 | **Ratified**: 2025-11-16 | **Last Amended**: 2025-11-16

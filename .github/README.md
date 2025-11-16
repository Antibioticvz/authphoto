# GitHub Configuration & SpecKit Integration

This directory contains GitHub-specific configuration files and SpecKit agents/prompts for managing the AuthPhoto development workflow.

## 📁 Directory Structure

```
.github/
├── workflows/           # GitHub Actions CI/CD workflows
│   ├── ci.yml          # Main CI pipeline (tests, lint, build)
│   └── spec-check.yml  # Specification validation
├── ISSUE_TEMPLATE/     # Issue templates
│   ├── feature.md      # Feature request template
│   └── bug.md          # Bug report template
├── PULL_REQUEST_TEMPLATE.md  # PR template with constitution checklist
├── agents/             # SpecKit agent configurations
│   ├── speckit.specify.agent.md
│   ├── speckit.plan.agent.md
│   ├── speckit.tasks.agent.md
│   ├── speckit.analyze.agent.md
│   ├── speckit.checklist.agent.md
│   ├── speckit.implement.agent.md
│   └── ...
└── prompts/            # SpecKit prompt templates
    ├── speckit.specify.prompt.md
    ├── speckit.plan.prompt.md
    └── ...
```

## 🚀 Quick Start

### Creating a New Feature

1. **Create Feature Specification:**
   ```bash
   ./.specify/scripts/bash/speckit-workflow.sh new my-feature
   ```

2. **Follow the SpecKit Workflow:**
   - `/speckit.specify` - Create detailed specification
   - `/speckit.plan` - Generate implementation plan
   - `/speckit.tasks` - Break down into tasks
   - `/speckit.analyze` - Validate consistency
   - `/speckit.checklist` - Generate implementation checklist

3. **Check Status:**
   ```bash
   ./.specify/scripts/bash/speckit-workflow.sh status my-feature
   ```

### Working with GitHub Issues

When creating issues, use the appropriate template:

- **Feature Requests**: Use `feature.md` template
  - Includes constitution alignment checklist
  - Links to SpecKit workflow
  - Defines acceptance criteria

- **Bug Reports**: Use `bug.md` template
  - Includes environment details
  - Constitution impact assessment
  - Reproduction steps

## 🔄 Development Workflow

### 1. Specification Phase

**Location:** `specs/[feature-id]/spec.md`

Use the `/speckit.specify` command with your AI agent to create:
- User stories with priorities
- Functional requirements
- Success criteria
- Edge cases

### 2. Planning Phase

**Location:** `specs/[feature-id]/plan.md`

Use the `/speckit.plan` command to generate:
- Architecture decisions
- Technology stack choices
- API design
- Database schema
- Testing strategy

### 3. Task Breakdown

**Location:** `specs/[feature-id]/tasks.md`

Use the `/speckit.tasks` command to create:
- Detailed task list
- Dependencies
- Acceptance criteria per task
- Test requirements

### 4. Analysis & Validation

Use the `/speckit.analyze` command to verify:
- Cross-artifact consistency
- Constitution alignment
- Completeness
- No contradictions

### 5. Implementation Checklist

Use the `/speckit.checklist` command to generate:
- Implementation tracking
- Constitution compliance checks
- Testing requirements
- Review criteria

## 🤖 GitHub Actions

### CI Workflow (`ci.yml`)

Runs on every push and PR to `main` and `develop`:

- **Backend Tests**
  - Installs dependencies
  - Runs linter
  - Executes tests
  - Builds project

- **Spec Validation**
  - Checks for required spec files
  - Validates constitution presence
  - Reports missing documentation

### Spec Check Workflow (`spec-check.yml`)

Runs when specs are modified:

- Validates completeness of specifications
- Checks constitution alignment
- Validates markdown syntax
- Reports warnings for incomplete specs

## 📋 Pull Request Process

When creating a PR, the template includes:

1. **Description & Related Issues**
2. **Specification Compliance**
   - Links to relevant spec files
   - Confirms implementation matches plan

3. **Constitution Compliance Checklist**
   - ✅ Test-First Development
   - ✅ Type Safety
   - ✅ Security
   - ✅ Code Quality

4. **Testing Evidence**
   - Test results
   - Manual testing notes
   - Coverage reports

## 🎯 Constitution Principles

All development must align with `.specify/memory/constitution.md`:

### I. Test-First Development (NON-NEGOTIABLE)
- Write tests first
- Get approval
- See tests fail
- Implement
- Watch tests pass
- ≥80% coverage required

### II. Type Safety
- TypeScript strict mode
- No `any` types without justification
- Runtime validation for external inputs

### III. Security First
- Validate and sanitize all input
- Authentication on sensitive endpoints
- Password hashing (bcrypt)
- HTTPS in production
- No hardcoded credentials

### IV. API-First Architecture
- RESTful design with versioning
- Consistent error responses
- Request/response validation
- Auto-generated documentation

### V. Code Quality
- ESLint/Prettier enforced
- Code reviews required
- Modular architecture
- Clear separation of concerns

## 🛠️ SpecKit Commands Reference

| Command | Purpose | Inputs | Outputs |
|---------|---------|--------|---------|
| `/speckit.specify` | Create specification | User requirements | `spec.md` |
| `/speckit.plan` | Generate plan | `spec.md` | `plan.md` |
| `/speckit.tasks` | Break into tasks | `plan.md` | `tasks.md` |
| `/speckit.analyze` | Validate consistency | All docs | Analysis report |
| `/speckit.checklist` | Implementation tracking | `tasks.md` | `checklist.md` |
| `/speckit.implement` | Start implementation | All docs | Implementation guidance |

## 📚 Additional Resources

- **Constitution:** `.specify/memory/constitution.md`
- **Technical Spec:** `.specify/memory/TECHNICAL_SPECIFICATION.md`
- **Development Guide:** `.specify/memory/DEVELOPMENT_GUIDE.md`
- **Templates:** `.specify/templates/`

## 🔍 Checking Feature Status

List all features:
```bash
./.specify/scripts/bash/speckit-workflow.sh list
```

Check specific feature:
```bash
./.specify/scripts/bash/speckit-workflow.sh status 001-backend-setup
```

## 💡 Tips

1. **Always start with specification** - Don't jump to implementation
2. **Follow the workflow order** - Each phase builds on the previous
3. **Use the constitution as a guide** - Reference it frequently
4. **Validate before implementing** - Run `/speckit.analyze` first
5. **Keep specs updated** - Treat them as living documents

## 🆘 Getting Help

- Check `.specify/memory/README.md` for project overview
- Review templates in `.specify/templates/`
- Use `speckit-workflow.sh --help` for command help
- Consult constitution for decision guidance

---

**Remember:** Quality over speed. The specification process saves time in the long run by preventing rework and ensuring alignment with project principles.

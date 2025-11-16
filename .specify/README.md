# .specify - SpecKit Configuration & Memory

This directory contains the SpecKit system configuration, project memory, and utility scripts for managing specifications and development workflow.

## 📁 Directory Structure

```
.specify/
├── memory/              # Project knowledge base
│   ├── constitution.md  # Core principles (NON-NEGOTIABLE)
│   ├── TECHNICAL_SPECIFICATION.md
│   ├── DEVELOPMENT_GUIDE.md
│   ├── API_PROTOCOL_AND_EXAMPLES.md
│   └── [feature-folders]/
├── scripts/             # Utility scripts
│   └── bash/
│       ├── speckit-workflow.sh      # Main workflow orchestrator
│       ├── create-new-feature.sh    # Feature scaffolding
│       ├── check-prerequisites.sh   # Validation
│       └── common.sh                # Shared utilities
└── templates/           # Document templates
    ├── spec-template.md
    ├── plan-template.md
    ├── tasks-template.md
    └── checklist-template.md
```

## 🎯 Purpose

The `.specify` folder serves as:

1. **Knowledge Repository** - Stores project documentation and decisions
2. **Constitution Authority** - Maintains non-negotiable principles
3. **Template Library** - Provides standardized document structures
4. **Workflow Automation** - Scripts for managing the specification process

## 📚 Memory Folder

### Constitution (`memory/constitution.md`)

**Status:** NON-NEGOTIABLE ⚠️

The constitution defines five core principles:

1. **Test-First Development**
   - Write tests before implementation
   - Minimum 80% coverage
   - Automated testing in CI/CD

2. **Type Safety**
   - TypeScript strict mode
   - No `any` without justification
   - Runtime validation for external inputs

3. **Security First**
   - Input validation and sanitization
   - Authentication for sensitive endpoints
   - No hardcoded credentials
   - HTTPS in production

4. **API-First Architecture**
   - RESTful design with versioning
   - Consistent error responses
   - Auto-generated documentation
   - Rate limiting and pagination

5. **Code Quality**
   - Linter enforced pre-commit
   - Code reviews required
   - Modular architecture
   - Clear separation of concerns

### Technical Documentation

- **TECHNICAL_SPECIFICATION.md** - System architecture and algorithms
- **API_PROTOCOL_AND_EXAMPLES.md** - API contracts and examples
- **DEVELOPMENT_GUIDE.md** - Setup and development instructions
- **DEVELOPMENT_PLAN.md** - Project roadmap and milestones

### Feature Memory

Each feature specification is stored in `memory/[feature-id]/`:
- `spec.md` - Requirements and user stories
- `plan.md` - Architecture and implementation plan
- `tasks.md` - Detailed task breakdown
- `checklist.md` - Implementation tracking

## 🛠️ Scripts

### SpecKit Workflow Orchestrator

**Location:** `scripts/bash/speckit-workflow.sh`

Main command-line interface for SpecKit operations:

```bash
# Create new feature
./speckit-workflow.sh new my-feature

# Check status
./speckit-workflow.sh status my-feature

# List all features
./speckit-workflow.sh list

# Show help
./speckit-workflow.sh --help
```

#### Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `new <name>` | Create new feature spec | `new user-auth` |
| `specify <id>` | Guide through spec phase | `specify 001-backend` |
| `plan <id>` | Guide through planning | `plan 001-backend` |
| `tasks <id>` | Guide through tasks | `tasks 001-backend` |
| `analyze <id>` | Validate consistency | `analyze 001-backend` |
| `checklist <id>` | Generate checklist | `checklist 001-backend` |
| `status [id]` | Show feature status | `status 001-backend` |
| `list` | List all features | `list` |

### Feature Creation Script

**Location:** `scripts/bash/create-new-feature.sh`

Creates a new feature specification folder with:
- Initial directory structure
- Template files
- Git branch suggestion
- Initial documentation

### Prerequisites Checker

**Location:** `scripts/bash/check-prerequisites.sh`

Validates environment setup:
- Checks for required files
- Validates directory structure
- Outputs JSON for automation
- Can include specific features

### Common Utilities

**Location:** `scripts/bash/common.sh`

Shared functions used by all scripts:
- Color output utilities
- Path resolution
- Error handling
- Logging functions

## 📋 Templates

### Specification Template (`spec-template.md`)

Structure for feature specifications:
- User scenarios & testing
- Prioritized user stories (P1, P2, P3...)
- Functional requirements
- Key entities
- Success criteria

**Key Features:**
- Independent testable stories
- Priority-based implementation
- Clear acceptance scenarios
- Technology-agnostic

### Plan Template (`plan-template.md`)

Structure for implementation plans:
- Architecture decisions
- Technology stack
- API design
- Database schema
- Testing strategy
- Deployment considerations

### Tasks Template (`tasks-template.md`)

Structure for task breakdowns:
- Numbered task list
- Dependencies
- Acceptance criteria
- Test requirements
- Estimated complexity

### Checklist Template (`checklist-template.md`)

Structure for implementation tracking:
- Task completion status
- Constitution compliance checks
- Testing verification
- Review requirements

## 🚀 Workflow Guide

### Complete Feature Development Flow

```bash
# 1. Create new feature
./.specify/scripts/bash/speckit-workflow.sh new photo-capture

# 2. Write specification (use AI agent)
# Run: /speckit.specify "Add photo capture functionality with validation"
# This creates: specs/002-photo-capture/spec.md

# 3. Generate implementation plan (use AI agent)
# Run: /speckit.plan
# This creates: specs/002-photo-capture/plan.md

# 4. Break down into tasks (use AI agent)
# Run: /speckit.tasks
# This creates: specs/002-photo-capture/tasks.md

# 5. Validate consistency (use AI agent)
# Run: /speckit.analyze
# Reviews all documents for consistency

# 6. Generate implementation checklist (use AI agent)
# Run: /speckit.checklist
# This creates: specs/002-photo-capture/checklist.md

# 7. Check status
./.specify/scripts/bash/speckit-workflow.sh status 002-photo-capture

# 8. Start implementation following the plan
# Run: /speckit.implement
```

### Status Indicators

When you run `speckit-workflow.sh status`, you'll see:

- 🟢 **Ready for Implementation** - All files present, validated
- 🟡 **Tasks Created** - Have tasks but no checklist
- 🟡 **Plan Created** - Have plan but no tasks
- 🔴 **Incomplete** - Missing required files

## 📖 Best Practices

### 1. Constitution First

Always reference the constitution when making decisions:

```bash
# Review constitution
cat .specify/memory/constitution.md

# Check principle section
grep "^###" .specify/memory/constitution.md
```

### 2. Progressive Workflow

Don't skip phases:
- ✅ Specify → Plan → Tasks → Analyze → Checklist
- ❌ Don't jump to implementation without specification

### 3. Keep Memory Updated

After completing a feature:
```bash
# Copy final docs to memory
cp specs/002-photo-capture/*.md .specify/memory/002-photo-capture/
```

### 4. Use Scripts

Don't manually create folders/files:
```bash
# ✅ Use script
./.specify/scripts/bash/speckit-workflow.sh new my-feature

# ❌ Don't do this
mkdir specs/my-feature
```

### 5. Validate Before Implementing

Always run analysis before starting work:
```bash
# Run consistency check
# Use AI agent: /speckit.analyze
```

## 🔍 Directory Organization

### Feature ID Convention

Use format: `NNN-feature-name`
- `001-backend-setup` ✅
- `002-photo-capture` ✅
- `backend-setup` ❌ (missing number)
- `1-backend` ❌ (number too short)

### File Naming

Required files in each feature folder:
- `spec.md` - Feature specification
- `plan.md` - Implementation plan
- `tasks.md` - Task breakdown
- `checklist.md` - Implementation tracking (optional)

## 🧪 Testing Integration

### Test Requirements from Constitution

Every feature must have:
1. **Unit Tests** (≥80% coverage)
2. **Integration Tests** (API endpoints)
3. **E2E Tests** (Critical user flows)

### Test File Organization

```
backend/
├── src/
│   ├── challenge/
│   │   ├── challenge.service.ts
│   │   └── challenge.service.spec.ts  ← Unit tests
│   └── ...
└── test/
    └── challenge.e2e-spec.ts  ← E2E tests
```

## 🔐 Security Considerations

From constitution, all features must:
- ✅ Validate all user input
- ✅ Sanitize before processing
- ✅ Use authentication for sensitive operations
- ✅ Hash passwords (bcrypt)
- ✅ Use environment variables for secrets
- ✅ Enforce HTTPS in production

## 📊 Metrics & Monitoring

Track:
- Specification completion rate
- Constitution compliance score
- Test coverage per feature
- Implementation time vs estimate

## 🆘 Troubleshooting

### Common Issues

**Issue:** Script not found
```bash
# Solution: Use full path from project root
./. specify/scripts/bash/speckit-workflow.sh list
```

**Issue:** Permission denied
```bash
# Solution: Make script executable
chmod +x .specify/scripts/bash/*.sh
```

**Issue:** Feature not found
```bash
# Solution: Check feature ID
./.specify/scripts/bash/speckit-workflow.sh list
```

## 📚 Additional Resources

- **GitHub Configuration:** `.github/README.md`
- **Project Overview:** `.specify/memory/README.md`
- **Constitution:** `.specify/memory/constitution.md`
- **Technical Spec:** `.specify/memory/TECHNICAL_SPECIFICATION.md`

## 🤝 Contributing

When adding new features to SpecKit:

1. Update templates if needed
2. Add scripts to `scripts/bash/`
3. Document in this README
4. Update constitution if principles change
5. Test workflow end-to-end

## 💡 Tips

1. **Read the constitution regularly** - It prevents mistakes
2. **Use templates** - They ensure consistency
3. **Run status checks** - Know where you are in the workflow
4. **Validate early** - Run analyze before implementing
5. **Keep docs updated** - They're your source of truth

---

**Remember:** The specification process is an investment. Taking time upfront to properly specify, plan, and break down work leads to faster, higher-quality implementation with fewer surprises.

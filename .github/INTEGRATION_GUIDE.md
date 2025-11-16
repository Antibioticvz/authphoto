# GitHub & SpecKit Integration Guide

## 🔗 System Integration Overview

```
┌──────────────────────────────────────────────────────────────────────┐
│                         AUTHPHOTO DEVELOPMENT SYSTEM                  │
└──────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐          ┌─────────────────────┐
│   .github/          │          │   .specify/         │
│   (GitHub Config)   │◄────────►│   (SpecKit System)  │
└──────────┬──────────┘          └──────────┬──────────┘
           │                                 │
           │                                 │
┌──────────▼──────────────────────────────────▼──────────┐
│                    DEVELOPMENT WORKFLOW                  │
│                                                          │
│  1. Issue Created (GitHub)                              │
│     │                                                    │
│     ↓                                                    │
│  2. Spec Created (SpecKit)                              │
│     │                                                    │
│     ↓                                                    │
│  3. Implementation (TDD)                                │
│     │                                                    │
│     ↓                                                    │
│  4. PR & Review (GitHub)                                │
│     │                                                    │
│     ↓                                                    │
│  5. CI/CD & Deploy (GitHub Actions)                     │
└─────────────────────────────────────────────────────────┘
```

## 🏗️ Component Relationships

### .github Directory

**Purpose:** GitHub-specific automation and templates

```
.github/
├── workflows/              ← CI/CD automation
│   ├── ci.yml             ← Runs tests, linter, build
│   └── spec-check.yml     ← Validates specifications
│
├── ISSUE_TEMPLATE/         ← Standardized issue creation
│   ├── feature.md         ← New feature template
│   └── bug.md             ← Bug report template
│
├── PULL_REQUEST_TEMPLATE.md ← PR checklist
│
├── agents/                 ← SpecKit agent configs
│   ├── speckit.specify.agent.md
│   ├── speckit.plan.agent.md
│   └── ...
│
└── prompts/                ← SpecKit prompt templates
    ├── speckit.specify.prompt.md
    └── ...
```

### .specify Directory

**Purpose:** Specification management and project memory

```
.specify/
├── memory/                 ← Project knowledge base
│   ├── constitution.md    ← Core principles (NON-NEGOTIABLE)
│   ├── TECHNICAL_SPECIFICATION.md
│   ├── DEVELOPMENT_GUIDE.md
│   └── [feature-folders]/
│
├── scripts/                ← Automation utilities
│   └── bash/
│       ├── speckit-workflow.sh    ← Main CLI
│       ├── create-new-feature.sh
│       └── check-prerequisites.sh
│
└── templates/              ← Document templates
    ├── spec-template.md
    ├── plan-template.md
    └── tasks-template.md
```

## 🔄 Integration Points

### 1. Issue Creation → Specification

**Flow:**
```
GitHub Issue (feature.md) → SpecKit Specification → specs/NNN-name/
```

**Steps:**
1. User creates issue using `.github/ISSUE_TEMPLATE/feature.md`
2. Issue includes constitution alignment checklist
3. After approval, run: `./speckit new feature-name`
4. SpecKit creates `specs/NNN-feature-name/`
5. Use AI agent: `/speckit.specify` to fill spec.md

**Integration:**
- Issue template references SpecKit workflow
- Constitution checklist ensures alignment
- Feature ID convention links issue to spec

### 2. Specification → Implementation

**Flow:**
```
SpecKit Phases → Code Implementation → Git Commits
```

**Steps:**
1. Complete SpecKit workflow (specify → plan → tasks)
2. Validate with: `/speckit.analyze`
3. Create branch: `git checkout -b NNN-feature-name`
4. Follow TDD (constitution requirement)
5. Commit after each task completion

**Integration:**
- Branch name matches spec folder name
- Commits reference tasks from tasks.md
- Tests written based on acceptance criteria

### 3. Implementation → Pull Request

**Flow:**
```
Git Branch → GitHub PR → Constitution Checklist → CI/CD
```

**Steps:**
1. Push branch to GitHub
2. Create PR using `.github/PULL_REQUEST_TEMPLATE.md`
3. Fill constitution compliance checklist
4. Link to specification in `specs/`
5. CI/CD runs automatically

**Integration:**
- PR template includes constitution checklist
- CI runs tests (required by constitution)
- Spec validation workflow checks docs
- Branch naming links PR to specification

### 4. Code Review → Merge

**Flow:**
```
PR Review → Constitution Validation → Merge → Deploy
```

**Steps:**
1. Reviewers check constitution compliance
2. Verify spec implementation
3. CI/CD must pass (green checks)
4. Minimum 1 approval required
5. Merge and auto-deploy

**Integration:**
- Review checklist matches constitution
- CI validates test coverage ≥80%
- Spec-check workflow validates docs
- Deployment follows development guide

## 🤖 GitHub Actions Integration

### CI Workflow (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main` or `develop`

**Jobs:**

1. **Backend Tests**
   ```yaml
   - Install dependencies
   - Run ESLint
   - Run tests
   - Build project
   ```

2. **Spec Validation**
   ```yaml
   - Check for required spec files
   - Validate constitution presence
   - Report missing documentation
   ```

**Integration with SpecKit:**
- Validates specs/ directory structure
- Ensures constitution.md exists
- Checks for plan.md and tasks.md in features

### Spec Check Workflow (`.github/workflows/spec-check.yml`)

**Triggers:**
- Changes to `specs/**`
- Changes to `.specify/**`

**Jobs:**

1. **Completeness Check**
   - Validates each spec has required files
   - Checks for spec.md or plan.md
   - Verifies tasks.md exists

2. **Constitution Alignment**
   - Extracts constitution principles
   - Reports on compliance

3. **Markdown Validation**
   - Checks markdown syntax
   - Validates headers present

## 📋 Issue Template Integration

### Feature Request Flow

**Template:** `.github/ISSUE_TEMPLATE/feature.md`

**Sections:**
1. Feature Description
2. User Story (As a/I want/So that)
3. Acceptance Criteria
4. Technical Considerations
5. **Constitution Alignment Checklist** ⭐
   - Test-First Development
   - Type Safety
   - Security First
   - API-First Architecture
   - Code Quality

**Integration:**
- Checklist items match constitution.md
- "Next Steps" section guides to SpecKit
- References `/speckit.specify` command

### Bug Report Flow

**Template:** `.github/ISSUE_TEMPLATE/bug.md`

**Sections:**
1. Bug Description
2. Steps to Reproduce
3. Expected vs Actual Behavior
4. Environment Details
5. **Constitution Impact** ⭐
   - Security impact?
   - Test coverage impact?
   - API contract impact?
   - Type safety impact?

## 📝 PR Template Integration

**Template:** `.github/PULL_REQUEST_TEMPLATE.md`

**Sections:**

1. **Specification Compliance**
   - Links to `specs/[feature-name]/`
   - Confirms following spec.md
   - Confirms following plan.md
   - Confirms completing tasks.md

2. **Constitution Compliance Checklist** ⭐
   - Test-First Development (✓ tests written first)
   - Type Safety (✓ strict mode, no any)
   - Security (✓ validation, authentication)
   - Code Quality (✓ linter, modular, documented)

3. **Testing Evidence**
   - Test output
   - Coverage report
   - Manual testing notes

**Integration:**
- Checklist items enforced by CI
- Links validated by spec-check workflow
- Constitution items match .specify/memory/constitution.md

## 🔐 Constitution Enforcement

### Constitution as Source of Truth

**Location:** `.specify/memory/constitution.md`

**Enforcement Points:**

1. **Issue Templates** (.github/ISSUE_TEMPLATE/)
   - Constitution checklist in feature.md
   - Constitution impact in bug.md

2. **PR Template** (.github/PULL_REQUEST_TEMPLATE.md)
   - Full constitution compliance checklist
   - Required before merge approval

3. **CI Workflows** (.github/workflows/)
   - Test coverage validation (≥80%)
   - Linter enforcement
   - Build verification

4. **SpecKit Agents** (.github/agents/)
   - Reference constitution in analysis
   - Validate alignment in /speckit.analyze

### Constitution Update Process

⚠️ **IMPORTANT:** Constitution is NON-NEGOTIABLE

**To update constitution:**
1. Create issue with justification
2. Team discussion required
3. Document reason for change
4. Update `.specify/memory/constitution.md`
5. Update all templates and checklists
6. Update CI workflows if needed
7. Communicate to all developers

## 🛠️ Developer Workflow Integration

### Complete Flow

```
┌────────────────────────────────────────────────────┐
│ 1. IDEA PHASE                                      │
├────────────────────────────────────────────────────┤
│ • Create GitHub Issue (.github/ISSUE_TEMPLATE/)    │
│ • Use feature.md or bug.md template                │
│ • Fill constitution checklist                      │
└────────────────────────┬───────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────┐
│ 2. SPECIFICATION PHASE (.specify/)                 │
├────────────────────────────────────────────────────┤
│ • ./speckit new feature-name                       │
│ • AI: /speckit.specify "requirements"              │
│ • Creates: specs/NNN-feature/spec.md               │
└────────────────────────┬───────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────┐
│ 3. PLANNING PHASE (.specify/)                      │
├────────────────────────────────────────────────────┤
│ • AI: /speckit.plan                                │
│ • Creates: specs/NNN-feature/plan.md               │
│ • References: constitution.md                      │
└────────────────────────┬───────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────┐
│ 4. TASK BREAKDOWN (.specify/)                      │
├────────────────────────────────────────────────────┤
│ • AI: /speckit.tasks                               │
│ • Creates: specs/NNN-feature/tasks.md              │
│ • Detailed implementation tasks                    │
└────────────────────────┬───────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────┐
│ 5. VALIDATION (.specify/)                          │
├────────────────────────────────────────────────────┤
│ • AI: /speckit.analyze                             │
│ • Validates constitution alignment                 │
│ • Checks consistency                               │
└────────────────────────┬───────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────┐
│ 6. IMPLEMENTATION (Git + TDD)                      │
├────────────────────────────────────────────────────┤
│ • git checkout -b NNN-feature-name                 │
│ • Write tests first (constitution requirement)     │
│ • Implement feature                                │
│ • Coverage ≥80%                                    │
└────────────────────────┬───────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────┐
│ 7. PULL REQUEST (.github/)                         │
├────────────────────────────────────────────────────┤
│ • git push origin NNN-feature-name                 │
│ • Create PR (PULL_REQUEST_TEMPLATE.md)             │
│ • Fill constitution checklist                      │
│ • CI/CD runs (.github/workflows/)                  │
└────────────────────────┬───────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────┐
│ 8. REVIEW & MERGE (.github/)                       │
├────────────────────────────────────────────────────┤
│ • Code review (≥1 approval)                        │
│ • CI must pass                                     │
│ • Constitution validated                           │
│ • Merge to main                                    │
└────────────────────────┬───────────────────────────┘
                         │
                         ↓
┌────────────────────────────────────────────────────┐
│ 9. DEPLOY (.github/workflows/)                     │
├────────────────────────────────────────────────────┤
│ • Auto-deploy on merge                             │
│ • Monitor production                               │
│ • Update documentation                             │
└────────────────────────────────────────────────────┘
```

## 📊 Status Tracking

### Check Integration Status

```bash
# Check SpecKit status
./speckit status feature-name

# Check GitHub workflows
git push  # Triggers CI

# Check constitution
cat .specify/memory/constitution.md
```

### Integration Health Indicators

✅ **Healthy Integration:**
- All CI workflows passing
- Specs validated
- Constitution referenced in PRs
- Tests coverage ≥80%
- All checks green

⚠️ **Needs Attention:**
- Some workflows failing
- Missing spec files
- Constitution checklist incomplete
- Test coverage < 80%

❌ **Integration Issues:**
- CI completely failing
- No specifications
- Constitution ignored
- No test coverage

## 🆘 Troubleshooting Integration

### Issue: CI Failing

**Check:**
1. Review workflow logs in GitHub Actions
2. Run tests locally: `npm test`
3. Check linter: `npm run lint`

### Issue: Spec Validation Failing

**Check:**
1. Verify spec files exist: `./speckit list`
2. Check constitution: `cat .specify/memory/constitution.md`
3. Run validation: `./.specify/scripts/bash/check-prerequisites.sh`

### Issue: PR Template Not Applied

**Check:**
1. Create PR from GitHub UI (not git CLI)
2. Verify template exists: `.github/PULL_REQUEST_TEMPLATE.md`
3. Check branch name format: `NNN-feature-name`

## 🎓 Best Practices

1. **Always reference constitution** before making decisions
2. **Use templates** for consistency
3. **Follow SpecKit workflow** in order
4. **Keep specs updated** with actual implementation
5. **Run CI locally** before pushing
6. **Fill checklists completely** in PRs
7. **Link issues to PRs** for traceability

## 📚 Additional Resources

- [Main README](../README.md)
- [GitHub Setup](.github/README.md)
- [SpecKit Guide](../.specify/README.md)
- [Constitution](../.specify/memory/constitution.md)
- [Workflow Diagram](../.specify/memory/SPECKIT_WORKFLOW.md)

---

**Remember:** Integration between GitHub and SpecKit ensures quality, traceability, and alignment with project principles. Use both systems together for best results! 🚀

# SpecKit Workflow Guide

## 📊 Complete Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     SPECKIT WORKFLOW                             │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────┐
                    │   NEW IDEA   │
                    └──────┬───────┘
                           │
                           ↓
          ╔════════════════════════════════╗
          ║  1. CREATE FEATURE             ║
          ║  ./speckit new feature-name    ║
          ╚════════════════════════════════╝
                           │
                           ↓
          ┌────────────────────────────────┐
          │  specs/NNN-feature-name/       │
          │  └── (empty folder created)    │
          └────────────────┬───────────────┘
                           │
                           ↓
          ╔════════════════════════════════╗
          ║  2. SPECIFY                    ║
          ║  AI: /speckit.specify          ║
          ║  "User requirements..."        ║
          ╚════════════════════════════════╝
                           │
                           ↓
          ┌────────────────────────────────┐
          │  specs/NNN-feature-name/       │
          │  └── spec.md ✓                 │
          │      - User stories            │
          │      - Requirements            │
          │      - Success criteria        │
          └────────────────┬───────────────┘
                           │
                           ↓
          ╔════════════════════════════════╗
          ║  3. PLAN                       ║
          ║  AI: /speckit.plan             ║
          ╚════════════════════════════════╝
                           │
                           ↓
          ┌────────────────────────────────┐
          │  specs/NNN-feature-name/       │
          │  ├── spec.md ✓                 │
          │  └── plan.md ✓                 │
          │      - Architecture            │
          │      - Technology stack        │
          │      - API design              │
          │      - Database schema         │
          └────────────────┬───────────────┘
                           │
                           ↓
          ╔════════════════════════════════╗
          ║  4. TASKS                      ║
          ║  AI: /speckit.tasks            ║
          ╚════════════════════════════════╝
                           │
                           ↓
          ┌────────────────────────────────┐
          │  specs/NNN-feature-name/       │
          │  ├── spec.md ✓                 │
          │  ├── plan.md ✓                 │
          │  └── tasks.md ✓                │
          │      - Detailed tasks          │
          │      - Dependencies            │
          │      - Acceptance criteria     │
          └────────────────┬───────────────┘
                           │
                           ↓
          ╔════════════════════════════════╗
          ║  5. ANALYZE                    ║
          ║  AI: /speckit.analyze          ║
          ║  (Validates consistency)       ║
          ╚════════════════════════════════╝
                           │
                    ┌──────┴──────┐
                    │             │
           ❌ Issues Found   ✓ All Good
                    │             │
                    ↓             ↓
            Fix and re-run   Continue
                    │             │
                    └──────┬──────┘
                           │
                           ↓
          ╔════════════════════════════════╗
          ║  6. CHECKLIST                  ║
          ║  AI: /speckit.checklist        ║
          ╚════════════════════════════════╝
                           │
                           ↓
          ┌────────────────────────────────┐
          │  specs/NNN-feature-name/       │
          │  ├── spec.md ✓                 │
          │  ├── plan.md ✓                 │
          │  ├── tasks.md ✓                │
          │  └── checklist.md ✓            │
          │      - Implementation tracking │
          │      - Constitution checks     │
          └────────────────┬───────────────┘
                           │
                           ↓
          ╔════════════════════════════════╗
          ║  7. IMPLEMENT                  ║
          ║  AI: /speckit.implement        ║
          ║  (Follow TDD)                  ║
          ╚════════════════════════════════╝
                           │
                           ↓
          ┌────────────────────────────────┐
          │  Write Tests First             │
          │  ├── Unit tests                │
          │  ├── Integration tests         │
          │  └── E2E tests                 │
          └────────────────┬───────────────┘
                           │
                           ↓
          ┌────────────────────────────────┐
          │  Implement Feature             │
          │  └── Follow plan.md            │
          └────────────────┬───────────────┘
                           │
                           ↓
          ┌────────────────────────────────┐
          │  Run Tests                     │
          │  └── Coverage ≥80%             │
          └────────────────┬───────────────┘
                           │
                           ↓
          ╔════════════════════════════════╗
          ║  8. REVIEW                     ║
          ║  - Create PR                   ║
          ║  - Constitution checklist      ║
          ║  - Code review                 ║
          ╚════════════════════════════════╝
                           │
                           ↓
          ╔════════════════════════════════╗
          ║  9. MERGE & DEPLOY             ║
          ║  - CI/CD passes                ║
          ║  - Deploy to production        ║
          ╚════════════════════════════════╝
                           │
                           ↓
                    ┌──────────────┐
                    │   COMPLETE   │
                    └──────────────┘
```

## 🎯 Phase Descriptions

### Phase 1: Create Feature

**Command:** `./speckit new feature-name`

**Creates:**
- New directory: `specs/NNN-feature-name/`
- Initial structure
- Git branch suggestion

**Duration:** 1-2 minutes

### Phase 2: Specify

**Command:** `/speckit.specify "User requirements..."`

**Creates:** `spec.md` with:
- Prioritized user stories (P1, P2, P3)
- Functional requirements
- Success criteria
- Edge cases

**Key Principles:**
- Technology-agnostic
- User-focused
- Independently testable stories
- Clear acceptance criteria

**Duration:** 15-30 minutes (depending on complexity)

### Phase 3: Plan

**Command:** `/speckit.plan`

**Creates:** `plan.md` with:
- Architecture decisions
- Technology stack
- API endpoints
- Database schema
- Testing strategy
- Deployment plan

**Key Principles:**
- References spec.md
- Follows constitution
- Technical details
- Implementation roadmap

**Duration:** 20-40 minutes

### Phase 4: Tasks

**Command:** `/speckit.tasks`

**Creates:** `tasks.md` with:
- Numbered task list
- Dependencies
- Acceptance criteria per task
- Test requirements
- Complexity estimates

**Key Principles:**
- Atomic tasks
- Clear dependencies
- Testable outcomes
- Follows plan.md

**Duration:** 15-25 minutes

### Phase 5: Analyze

**Command:** `/speckit.analyze`

**Validates:**
- Cross-artifact consistency
- Constitution alignment
- No contradictions
- Completeness

**Output:**
- Analysis report
- Issues found
- Recommendations

**Duration:** 5-10 minutes

### Phase 6: Checklist

**Command:** `/speckit.checklist`

**Creates:** `checklist.md` with:
- Task tracking
- Constitution compliance checks
- Testing requirements
- Review criteria

**Duration:** 5 minutes

### Phase 7: Implement

**Command:** `/speckit.implement`

**Process:**
1. Write tests first (TDD)
2. Implement feature
3. Run tests
4. Verify coverage ≥80%
5. Commit

**Duration:** Varies (hours to days)

### Phase 8: Review

**Process:**
1. Create Pull Request
2. Fill PR template
3. Constitution checklist
4. Code review (≥1 approval)
5. CI/CD must pass

**Duration:** 1-2 days

### Phase 9: Merge & Deploy

**Process:**
1. All checks pass
2. Merge to main
3. CI/CD deployment
4. Monitor production

**Duration:** Minutes to hours

## 📋 Status Checks

### Check Feature Status

```bash
./speckit status feature-name
```

**Output Example:**
```
📊 Status for: 001-backend-setup

Specification Phase:
  ✓ spec.md exists

Planning Phase:
  ✓ plan.md exists

Task Breakdown:
  ✓ tasks.md exists
    Total tasks: 15

Implementation Readiness:
  ✓ checklist.md exists

✓ Constitution available for reference
```

### List All Features

```bash
./speckit list
```

**Output Example:**
```
📋 Features in specs/

  • 001-backend-setup - Ready for Implementation
    ✓ spec.md
    ✓ plan.md
    ✓ tasks.md
    ✓ checklist.md

  • 002-photo-capture - Tasks Created
    ✓ spec.md
    ✓ plan.md
    ✓ tasks.md
```

## 🔄 Common Workflows

### Happy Path (Everything Goes Well)

```bash
# 1. Create
./speckit new user-auth

# 2-6. Use AI agent for each phase
# (each command creates the next file)

# 7. Check everything is ready
./speckit status user-auth

# 8. Start implementation
git checkout -b 003-user-auth
# Follow TDD process

# 9. Create PR when done
```

### Fix Issues Path

```bash
# After /speckit.analyze finds issues

# 1. Review analysis report
# 2. Update spec.md or plan.md as needed
# 3. Regenerate tasks if plan changed
# 4. Re-run analyze
# 5. Continue when clean
```

### Iterative Refinement

```bash
# If requirements change mid-implementation

# 1. Update spec.md
./speckit status feature-name

# 2. Regenerate plan
# AI: /speckit.plan

# 3. Update tasks
# AI: /speckit.tasks

# 4. Validate
# AI: /speckit.analyze

# 5. Update checklist
# AI: /speckit.checklist

# 6. Continue implementation
```

## 🎓 Best Practices

### DO ✅

1. **Follow the order** - Don't skip phases
2. **Validate early** - Run analyze before implementing
3. **Keep docs updated** - Reflect changes in specs
4. **Use TDD** - Write tests first, always
5. **Reference constitution** - Check alignment regularly
6. **Small commits** - Commit after each task
7. **Request reviews** - Get feedback early

### DON'T ❌

1. **Skip specification** - Don't jump to code
2. **Ignore constitution** - It's non-negotiable
3. **Skip tests** - Coverage must be ≥80%
4. **Create manual files** - Use SpecKit commands
5. **Mix concerns** - One feature per branch
6. **Rush implementation** - Quality over speed
7. **Ignore warnings** - Address issues early

## 📊 Metrics to Track

### Specification Quality
- Time from idea to complete spec
- Number of analyze iterations needed
- Constitution compliance score

### Implementation Quality
- Test coverage percentage
- CI/CD pass rate
- Code review cycles

### Velocity
- Time from spec to implementation
- Average task completion time
- Features completed per sprint

## 🆘 Troubleshooting

### Workflow Issues

**Problem:** AI agent doesn't create file

**Solution:** Check prerequisites
```bash
./speckit status feature-name
# Ensure previous phase is complete
```

---

**Problem:** Analyze finds many issues

**Solution:** Review constitution
```bash
cat .specify/memory/constitution.md
# Update docs to align
```

---

**Problem:** Tests failing

**Solution:** Follow TDD strictly
```bash
# 1. Write test first
# 2. See it fail
# 3. Implement minimum to pass
# 4. Refactor
```

## 🔗 Related Documentation

- [Constitution](.specify/memory/constitution.md)
- [GitHub Integration](../.github/README.md)
- [SpecKit System](.specify/README.md)
- [Technical Specification](TECHNICAL_SPECIFICATION.md)

---

**Remember:** SpecKit is designed to save you time by catching issues early and ensuring alignment with project principles. Trust the process!

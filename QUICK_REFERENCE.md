# AuthPhoto - Quick Reference Guide

## 🚀 Essential Commands

### SpecKit Workflow

```bash
# Create new feature
./speckit new feature-name

# Check status
./speckit status feature-name
./speckit status              # All features

# List all features
./speckit list
```

### Development

```bash
# Backend
cd backend
npm install                   # Install dependencies
npm run start:dev            # Start dev server
npm test                     # Run tests
npm run test:cov            # Test coverage
npm run lint                 # Check code style
npm run build                # Production build

# Check API
curl http://localhost:3000/health
```

### Git Workflow

```bash
# Create feature branch
git checkout -b NNN-feature-name

# Regular commits
git add .
git commit -m "feat: description"

# Push and create PR
git push origin NNN-feature-name
```

## 📋 SpecKit Phases

| Phase | AI Command | Output | Required |
|-------|-----------|--------|----------|
| 1. Specify | `/speckit.specify "requirements"` | spec.md | spec.md or plan.md |
| 2. Plan | `/speckit.plan` | plan.md | spec.md |
| 3. Tasks | `/speckit.tasks` | tasks.md | plan.md |
| 4. Analyze | `/speckit.analyze` | Report | tasks.md |
| 5. Checklist | `/speckit.checklist` | checklist.md | tasks.md |
| 6. Implement | `/speckit.implement` | Guidance | checklist.md |

## 🎯 Constitution Quick Check

### ✅ Before Every Commit

- [ ] Tests written first
- [ ] All tests passing
- [ ] Coverage ≥80%
- [ ] No TypeScript `any` types
- [ ] Input validation added
- [ ] No hardcoded credentials
- [ ] ESLint passes
- [ ] Code formatted (Prettier)

### ✅ Before Every PR

- [ ] Follows spec.md
- [ ] Constitution checklist complete
- [ ] CI/CD passing
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance acceptable

## 📁 Directory Map

```
/                           # Project root
├── .github/               # GitHub config & SpecKit agents
│   ├── workflows/        # CI/CD
│   ├── ISSUE_TEMPLATE/   # Issue templates
│   └── README.md         # GitHub docs
├── .specify/             # SpecKit system
│   ├── memory/          # Project memory
│   ├── scripts/         # Utility scripts
│   ├── templates/       # Document templates
│   └── README.md        # SpecKit docs
├── backend/             # NestJS backend
│   ├── src/            # Source code
│   └── test/           # Tests
├── specs/              # Feature specifications
│   └── NNN-name/      # Each feature
├── speckit             # CLI wrapper
└── README.md          # Main docs
```

## 🔧 Common Tasks

### Start New Feature

```bash
# 1. Create spec
./speckit new photo-upload

# 2. Use AI to specify
# AI: /speckit.specify "Allow users to upload photos"

# 3. Continue through phases
# AI: /speckit.plan
# AI: /speckit.tasks
# AI: /speckit.analyze
# AI: /speckit.checklist

# 4. Start coding
git checkout -b 002-photo-upload
cd backend
# Write tests first!
```

### Run All Quality Checks

```bash
cd backend

# Lint
npm run lint

# Format
npm run format

# Test
npm run test:cov

# Build
npm run build
```

### Verify Constitution Compliance

```bash
# Check constitution
cat .specify/memory/constitution.md | grep "^###"

# Check feature spec
./speckit status feature-name

# Validate docs
./.specify/scripts/bash/check-prerequisites.sh --json
```

## 🐛 Troubleshooting Quick Fixes

### Problem: Tests Failing

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Problem: Linter Errors

```bash
# Auto-fix
npm run lint:fix
npm run format
```

### Problem: SpecKit Command Not Working

```bash
# Fix permissions
chmod +x speckit
chmod +x .specify/scripts/bash/*.sh

# Try direct path
./.specify/scripts/bash/speckit-workflow.sh --help
```

### Problem: Git Branch Issues

```bash
# Check current branch
git branch

# Switch to feature branch
git checkout -b NNN-feature-name

# Update from main
git fetch origin
git rebase origin/main
```

## 📊 API Quick Reference

### Challenge Endpoint

```bash
curl -X POST http://localhost:3000/api/v1/challenge \
  -H "Content-Type: application/json" \
  -d '{"clientId": "test-client"}'
```

### Capture Endpoint

```bash
curl -X POST http://localhost:3000/api/v1/capture \
  -F "challengeId=uuid" \
  -F "photo=@image.jpg" \
  -F "message=Test message"
```

### Health Check

```bash
curl http://localhost:3000/health
```

## 🔗 Important Files

| File | Purpose | When to Read |
|------|---------|--------------|
| `.specify/memory/constitution.md` | Core principles | Before every feature |
| `.specify/memory/TECHNICAL_SPECIFICATION.md` | System design | Understanding architecture |
| `.github/README.md` | GitHub integration | Setting up CI/CD |
| `.specify/README.md` | SpecKit system | Learning workflow |
| `SPECKIT_WORKFLOW.md` | Workflow diagram | Visual reference |

## 💡 Pro Tips

1. **Always check status** before moving to next phase
2. **Reference constitution** when making decisions
3. **Write tests first** - it's faster in the long run
4. **Use templates** - don't create files manually
5. **Small commits** - easier to review and revert
6. **Ask for review early** - catch issues sooner
7. **Keep specs updated** - they're your documentation

## 🆘 Need Help?

```bash
# SpecKit help
./speckit --help

# Check project status
./speckit list

# View constitution
cat .specify/memory/constitution.md

# View workflow diagram
cat .specify/memory/SPECKIT_WORKFLOW.md
```

## 📚 Learn More

- Full README: [README.md](README.md)
- GitHub Setup: [.github/README.md](.github/README.md)
- SpecKit Guide: [.specify/README.md](.specify/README.md)
- Workflow: [.specify/memory/SPECKIT_WORKFLOW.md](.specify/memory/SPECKIT_WORKFLOW.md)
- Constitution: [.specify/memory/constitution.md](.specify/memory/constitution.md)

---

**Remember:** Quality > Speed. The SpecKit process prevents bugs and rework! 🚀

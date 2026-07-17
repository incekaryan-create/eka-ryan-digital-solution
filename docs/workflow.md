# Development Workflow

## Git Workflow

### Branch Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### Commands

#### Start New Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/new-feature
```

#### Finish Feature
```bash
git checkout develop
git merge feature/new-feature
git push origin develop
git branch -d feature/new-feature
```

#### Hotfix
```bash
git checkout main
git pull origin main
git checkout -b hotfix/fix-bug
# fix bug
git checkout main
git merge hotfix/fix-bug
git push origin main
git checkout develop
git merge hotfix/fix-bug
git branch -d hotfix/fix-bug
```

## Commit Convention

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

### Examples
```
feat(auth): add OAuth support

- Added Google OAuth
- Added GitHub OAuth
- Updated login page

Closes #123
```

## Code Review

### Checklist
- [ ] Code follows style guide
- [ ] Tests pass
- [ ] No security issues
- [ ] Documentation updated
- [ ] No console logs

## Release Process

### Version Bump
```bash
# Patch version
npm version patch

# Minor version
npm version minor

# Major version
npm version major
```

### Create Release
1. Update CHANGELOG.md
2. Bump version
3. Create git tag
4. Push to GitHub
5. Create GitHub Release

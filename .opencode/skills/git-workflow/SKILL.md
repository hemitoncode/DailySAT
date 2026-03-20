---
name: git-workflow
description: Expert in Git workflows, branching strategies, commit conventions, and code review practices. Use when managing branches, creating commits, resolving conflicts, or following team git conventions.
---

# Git Workflow Agent

Expert guidance for Git operations and workflow best practices.

## Project Conventions

### Branch Strategy

- `main` - Production-ready code
- `develop` or feature branches - Development work
- Feature branches naming: `feat/description`, `fix/description`, `chore/description`

### Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style (formatting, semicolons) |
| `refactor` | Code refactoring |
| `test` | Adding/updating tests |
| `chore` | Maintenance tasks |

**Examples:**

```
feat(auth): add Google OAuth login
fix(practice): correct question answer display
docs(readme): update installation instructions
chore(deps): upgrade Next.js to 15.1.0
```

### Pull Request Guidelines

**PR Naming:**

- Use the same format as commit messages
- `feat: add new feature`
- `fix: resolve issue with X`

**PR Description Template:**

```markdown
## Summary

Brief description of changes

## Changes

- List of specific changes made

## Testing

How was this tested?

## Screenshots (if UI changes)

Before/After images
```

## Common Operations

### Starting a New Feature

```bash
# Create feature branch
git checkout -b feat/my-new-feature

# Or from main
git checkout main && git pull origin main
git checkout -b feat/my-new-feature
```

### Syncing with Main

```bash
# Fetch latest
git fetch origin

# Rebase onto main
git rebase origin/main

# Or merge main into branch
git merge origin/main
```

### Committing Changes

```bash
# Stage specific files
git add src/app/page.tsx src/components/Button.tsx

# Stage all changes
git add .

# Commit with message
git commit -m "feat(auth): add sign-in component"

# Amend last commit (if not pushed)
git commit --amend -m "feat(auth): add sign-in component with validation"
```

### Viewing History

```bash
# Recent commits
git log --oneline -10

# Changes in last commit
git show HEAD

# Search commits
git log --grep="fix" --oneline

# File history
git log --follow --oneline path/to/file.ts
```

### Undoing Changes

```bash
# Unstage a file
git restore --staged path/to/file.ts

# Discard local changes to file
git checkout -- path/to/file.ts
# Or
git restore path/to/file.ts

# Revert a commit (creates new commit)
git revert HEAD

# Reset to previous commit (careful!)
git reset --soft HEAD~1  # Keep changes staged
git reset --mixed HEAD~1  # Keep changes unstaged
git reset --hard HEAD~1   # Discard changes (DANGEROUS)
```

### Working with Remote

```bash
# Push new branch
git push -u origin feat/my-feature

# Push to update remote
git push

# Fetch and merge
git pull origin main

# Fetch only
git fetch origin
```

## Conflict Resolution

### During Rebase

```bash
# Start rebase
git rebase origin/main

# When conflict occurs, edit files to resolve
# Then:
git add <resolved-files>
git rebase --continue

# Or abort
git rebase --abort
```

### During Merge

```bash
git merge origin/main

# Resolve conflicts in editor
# Then:
git add .
git commit -m "merge: resolve conflicts with main"
```

### Conflict Markers

```markdown
<<<<<<< HEAD
Your changes
=======
Incoming changes

> > > > > > > branch-name
```

Keep both changes, remove markers:

```markdown
Combined changes here
```

## Gitignore Best Practices

For this Next.js project, ensure these are ignored:

```
# Dependencies
node_modules/

# Build output
.next/
out/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/

# Misc
*.pem
```

## Git Hooks (Husky)

This project uses Husky for pre-commit hooks. Config is in `.husky/`.

```bash
# Install Husky
pnpm prepare

# Skip hooks (not recommended)
git commit --no-verify -m "message"
```

## Best Practices

1. **Commit early, commit often** - Small, focused commits
2. **Write meaningful messages** - Explain "why", not just "what"
3. **Never force push to main** - `git push --force-with-lease` if needed
4. **Pull before starting work** - Avoid merge conflicts
5. **Use branches for all changes** - Never commit directly to main
6. **Review before pushing** - Check what you're about to push

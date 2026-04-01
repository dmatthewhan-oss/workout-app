# Claude Code Instructions

## Git & GitHub

After every change or set of changes, automatically commit and push to GitHub:

```bash
git add <changed files>
git commit -m "<descriptive message>"
git push origin main
```

- Always push to `origin main` after committing
- Use descriptive commit messages so individual changes are easy to identify and revert if needed
- This enables version recovery via GitHub if a mistake is made

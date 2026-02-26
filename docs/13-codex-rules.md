# 13 - Codex Rules for Automations

## Purpose
This project includes Codex execution policy rules for automation runs.

Rules file:
- `codex/rules/default.rules`

The rules are written in Starlark using `prefix_rule(...)` and are designed for:
- running security checks on `main`
- parsing outputs and generating fingerprints
- creating GitHub issues labeled `vulnerability`
- blocking destructive operations

## Allowed command groups
- Git sync on main: `git fetch`, `git checkout main`, `git pull --ff-only`
- Quality/security checks: `npm install`, `npm run verify`, `npm run security:scan`, `npm audit`
- Parsing/reporting utilities: `cat`, `sed`, `awk`, `rg`, `jq`, `tee`, etc.
- GitHub issue operations: `gh issue list/view/create`, `gh label list`

## Forbidden commands
- `git push ...`
- `git reset --hard ...`
- `rm -rf ...`

## Shell wrappers
- `bash -lc`, `bash -c`, `zsh -lc`, etc. are set to `prompt` to avoid hidden compound commands.

## How to validate locally
Use the official checker:

```bash
codex execpolicy check --pretty \
  --rules codex/rules/default.rules \
  -- npm run verify
```

Example forbidden check:

```bash
codex execpolicy check --pretty \
  --rules codex/rules/default.rules \
  -- git push origin main
```

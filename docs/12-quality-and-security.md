# 12 - Quality and Security Tooling

## Implemented tools
- ESLint + TypeScript rules (`eslint.config.mjs`)
- Prettier (`.prettierrc.json`)
- Unit tests with Vitest (`tests/**/*.test.ts`)
- Coverage thresholds in `vitest.config.ts`
- Dependency audit with `npm audit`
- Optional local SAST and secret scan hooks:
  - Semgrep (`.semgrep.yml`)
  - Gitleaks (`scripts/security-check.sh`)

## Daily commands
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:coverage`
- `npm run security:audit`
- `npm run verify`

## Extended security scan
- `npm run security:scan`

Note:
- `security:scan` always runs `npm audit`.
- It runs Semgrep and Gitleaks only if they are installed locally.

## Recommended local installs for full security checks
- Semgrep: `brew install semgrep`
- Gitleaks: `brew install gitleaks`

## Suggested baseline for automations
1. `npm install`
2. `npm run verify`
3. `npm run security:scan`

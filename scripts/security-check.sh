#!/usr/bin/env bash
set -euo pipefail

echo "[security] Running npm audit..."
npm run security:audit

if command -v semgrep >/dev/null 2>&1; then
  echo "[security] Running semgrep with .semgrep.yml..."
  semgrep --config .semgrep.yml --error .
else
  echo "[security] semgrep not found. Skipping semgrep scan."
fi

if command -v gitleaks >/dev/null 2>&1; then
  echo "[security] Running gitleaks..."
  gitleaks detect --source . --no-banner --redact
else
  echo "[security] gitleaks not found. Skipping secret scan."
fi

echo "[security] Security checks completed."

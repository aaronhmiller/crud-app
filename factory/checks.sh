#!/usr/bin/env bash
# The gate. Runs from the repo root (the gate runs it inside the job's
# worktree). Exit 0 means the build may proceed to review.
set -euo pipefail
cd app

# Dependencies, installed exactly as locked. Skipped when node_modules is
# already current, so repeat runs stay fast.
if [ ! -f node_modules/.package-lock.json ] || [ package-lock.json -nt node_modules/.package-lock.json ]; then
  npm ci --no-audit --no-fund --loglevel=error
fi

# Style: standard (https://standardjs.com), the project's only lint.
npx --no-install standard

# Syntax: every JavaScript file must parse.
for f in *.js $(find test -name '*.js' 2>/dev/null); do
  node --check "$f"
done

# Unit tests: node:test over app/test/**. Passes when there are none yet.
node --test

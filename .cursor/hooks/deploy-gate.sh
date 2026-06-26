#!/usr/bin/env bash
# FunCode deploy/infra gate (beforeShellExecution).
#
# Why this exists: deployment is governed by the Chain (ROL-3 Deployment, STD-7).
# Rules alone are passive — they failed exactly when attention was on the urgent fix
# (see pb-feedback FB-010). This hook fires deterministically at the command boundary
# so the Chain is retrieved *before* any deploy/infra command runs, not rediscovered after.
#
# Behavior: on a deploy/infra command -> permission "ask" with a pre-flight checklist.
#           everything else -> "allow".
set -euo pipefail

input="$(cat)"

# Extract the command string (jq is verified present; python3 is the fallback).
if command -v jq >/dev/null 2>&1; then
  command="$(printf '%s' "$input" | jq -r '.command // empty')"
else
  command="$(printf '%s' "$input" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("command",""))' 2>/dev/null || true)"
fi

# Deploy/infra command family. Pushing main auto-deploys funcode.club (INS-23),
# so `git push` is included.
deploy_re='railway|vercel|netlify|wrangler|flyctl|convex deploy|git push'

if printf '%s' "$command" | grep -Eq "$deploy_re"; then
  cat <<'JSON'
{
  "permission": "ask",
  "user_message": "Deployment/infra command detected. FunCode deploys are governed by ROL-3 (Deployment) + STD-7. Pre-flight: (1) pb whoami = FunCode, (2) retrieved `pb get ROL-3 STD-7 INS-23`, (3) the three traps hold — Railway Root Directory=web, @sveltejs/adapter-node, PORT=8080. Proceed?",
  "agent_message": "Governed deploy/infra command. Before proceeding: run `pb get ROL-3 STD-7 INS-23` and verify the three silent traps (Railway Root Directory=web, @sveltejs/adapter-node never adapter-auto, PORT=8080). Note: pushing main auto-deploys funcode.club (INS-23). Capture any new infra learning into STD-7 under ROL-3 afterward."
}
JSON
  exit 0
fi

echo '{ "permission": "allow" }'
exit 0

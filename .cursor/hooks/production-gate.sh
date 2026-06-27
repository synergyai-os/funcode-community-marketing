#!/usr/bin/env bash
# Production hard gate (beforeShellExecution).
#
# Any touch of production infra or the live funcode.club surface requires explicit
# human approval. Agents must not operate production autonomously (BR-3).
set -euo pipefail

input="$(cat)"

if command -v jq >/dev/null 2>&1; then
  command="$(printf '%s' "$input" | jq -r '.command // empty')"
else
  command="$(printf '%s' "$input" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("command",""))' 2>/dev/null || true)"
fi

# Deploy / push families (deploy-gate also covers these — belt and suspenders).
deploy_re='railway|vercel|netlify|wrangler|flyctl|convex deploy|git push'

# Live site + prod env hints.
prod_re='funcode\.club|railway\.app|RAILWAY_|NODE_ENV=production|\.env\.production|\.env\.prod|--prod\b|production deploy'

if printf '%s' "$command" | grep -Eiq "$deploy_re"; then
  cat <<JSON
{
  "permission": "ask",
  "user_message": "PRODUCTION GATE: deploy/push command detected. FunCode live site and infra require your explicit approval. Confirm you retrieved ROL-3 + STD-7 and intend to touch production.",
  "agent_message": "production-gate: deploy/push blocked pending user approval. Run pb get ROL-3 STD-7 INS-23 before any production change."
}
JSON
  exit 0
fi

if printf '%s' "$command" | grep -Eiq "$prod_re"; then
  cat <<JSON
{
  "permission": "ask",
  "user_message": "PRODUCTION GATE: command references production (funcode.club, prod env, or --prod). Allow only if you explicitly intend a production operation.",
  "agent_message": "production-gate: production-targeting command requires user approval. Default to local/dev only."
}
JSON
  exit 0
fi

echo '{ "permission": "allow" }'
exit 0

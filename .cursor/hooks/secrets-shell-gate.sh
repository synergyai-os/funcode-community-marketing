#!/usr/bin/env bash
# Below-the-waterline secrets shell gate (beforeShellExecution).
#
# Blocks shell commands that would dump or traverse secrets without human approval.
set -euo pipefail

input="$(cat)"

if command -v jq >/dev/null 2>&1; then
  command="$(printf '%s' "$input" | jq -r '.command // empty')"
else
  command="$(printf '%s' "$input" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("command",""))' 2>/dev/null || true)"
fi

# Reading or printing env files / secret material via shell.
secrets_read_re='(\.env(\.local|\.production|\.prod)?|config\.local\.json|\.pem|\.key\b|OPENROUTER_API_KEY|CASTMAGIC_API_KEY|API_SECRET|printenv|(^|[;&|]\s*)env(\s|$))'

# Attempts to cat/grep/source env files (common leak paths).
env_file_re='(cat|head|tail|less|more|grep|rg|source|export)\s+.*\.env'

if printf '%s' "$command" | grep -Eiq "$secrets_read_re"; then
  cat <<JSON
{
  "permission": "ask",
  "user_message": "Shell command may expose below-the-waterline secrets (.env.local, API keys, printenv). Allow only if you are intentionally debugging env setup.",
  "agent_message": "secrets-shell-gate: this command may read or print secrets. Do not run without user approval. Never log or repeat secret values."
}
JSON
  exit 0
fi

if printf '%s' "$command" | grep -Eiq "$env_file_re"; then
  cat <<JSON
{
  "permission": "ask",
  "user_message": "Shell command may read a secrets file via cat/grep/source. Allow only if intentional.",
  "agent_message": "secrets-shell-gate: command targets .env files. Ask user before proceeding."
}
JSON
  exit 0
fi

echo '{ "permission": "allow" }'
exit 0

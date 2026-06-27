#!/usr/bin/env bash
# Below-the-waterline secrets read gate (beforeReadFile).
#
# Class: highest — .env.local, credentials, keys. Agents MUST get human
# approval before reading these files (BR-3 hull-breach: secrets exposure).
set -euo pipefail

input="$(cat)"

if command -v jq >/dev/null 2>&1; then
  path="$(printf '%s' "$input" | jq -r '.file_path // .filePath // .path // empty')"
else
  path="$(printf '%s' "$input" | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("file_path") or d.get("filePath") or d.get("path") or "")' 2>/dev/null || true)"
fi

# Normalize to basename check + path suffix (works for absolute and relative paths).
base="$(basename "${path:-}")"

secrets_re='^(\.env(\.local|\.production|\.prod)?|.*\.(pem|key|p12|pfx)|credentials\.json|\.productbrain/config\.local\.json)$'

if [[ -n "$path" ]] && { [[ "$base" =~ $secrets_re ]] || [[ "$path" =~ /\.env(\.local|\.production)?$ ]] || [[ "$path" =~ /config\.local\.json$ ]]; }; then
  cat <<JSON
{
  "permission": "ask",
  "user_message": "Agent wants to READ a below-the-waterline secrets file (${base}). This is highest-class protected. Allow only if you intend to share keys or debug env setup — never paste secrets into chat.",
  "agent_message": "BLOCKED by secrets-read-gate: do not read ${path} without explicit user approval. Secrets files are below the waterline (BR-3). Ask Randy first; never echo secret values in responses or commits."
}
JSON
  exit 0
fi

echo '{ "permission": "allow" }'
exit 0

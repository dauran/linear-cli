#!/bin/bash
# ticket-status.sh — Changes the status of a Linear ticket
# Usage: ./scripts/ticket-status.sh <TICKET_NUMBER> --statusId <STATE_ID>
#   ex: ./scripts/ticket-status.sh DAU-42 --statusId 123-456
#
# Requires the LINEAR_API_KEY variable (or source one of the wrappers
# linear-perso.sh / linear-work.sh before calling this script).

set -euo pipefail

# ── Helpers ───────────────────────────────────────────────────────────────────
die() { echo "❌  $*" >&2; exit 1; }
usage() {
  echo "Usage: $0 <TICKET_NUMBER> --statusId <STATE_ID>"
  echo "  ex:  $0 DAU-42 --statusId 123-456"
  exit 1
}

# ── Validation ────────────────────────────────────────────────────────────────
command -v jq &>/dev/null || die "jq is required (brew install jq)."
[[ $# -lt 1 ]] && usage

TICKET="$1"
shift

# Parse --statusId flag
STATUS_ID=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --statusId)
      [[ $# -lt 2 ]] && die "The --statusId option requires a value."
      STATUS_ID="$2"
      shift 2
      ;;
    *)
      die "Unknown option: $1"
      ;;
  esac
done

[[ -z "$STATUS_ID" ]] && die "The statusId is missing. Use --statusId <STATE_ID>."

# ── Linear binary resolution ─────────────────────────────────────────────
LINEAR_BIN="linear"
if [[ ! -x "$LINEAR_BIN" ]]; then
  LINEAR_BIN="$(command -v linear 2>/dev/null || true)"
  [[ -z "$LINEAR_BIN" ]] && die "Binary 'linear' not found. Compile it with: deno task mac"
fi

run() { "$LINEAR_BIN" "$@" 2>/dev/null; }

# ── Fetch issue (to get the internal ID and the current state) ─────────────────
echo "🔍 Resolving ticket $TICKET..."
ISSUE_JSON="$(run issue get "$TICKET")"
[[ -z "$ISSUE_JSON" || "$ISSUE_JSON" == "null" ]] && die "Ticket '$TICKET' not found."

ISSUE_ID="$(echo "$ISSUE_JSON" | jq -r '.id')"
ISSUE_TITLE="$(echo "$ISSUE_JSON" | jq -r '.title // "(no title)"')"
CURRENT_STATE="$(echo "$ISSUE_JSON" | jq -r '.state.name // "unknown"')"
CURRENT_STATE_ID="$(echo "$ISSUE_JSON" | jq -r '.state.id // "unknown"')"

echo "📋 Ticket  : [$TICKET] $ISSUE_TITLE"
echo "📊 Current status : $CURRENT_STATE (\`$CURRENT_STATE_ID\`)"

if [[ "$CURRENT_STATE_ID" == "$STATUS_ID" ]]; then
  echo ""
  echo "✅ Ticket already has the requested status (\`$STATUS_ID\`)."
  exit 0
fi

echo "🔄 Changing to status : \`$STATUS_ID\`..."

# ── Status update ─────────────────────────────────────────────────────
RESULT="$(run issue update "$ISSUE_ID" --state-id "$STATUS_ID")"

NEW_STATE_ID="$(echo "$RESULT" | jq -r '._state.id // empty')"
ISSUE_URL="$(echo "$RESULT" | jq -r '.url // empty')"

if [[ -n "$NEW_STATE_ID" ]]; then
  echo ""
  echo "✅ Status successfully updated!"
  echo ""
  echo "  🎫 Ticket  : [$TICKET] $ISSUE_TITLE"
  echo "  📊 New status : \`$NEW_STATE_ID\`"
  [[ -n "$ISSUE_URL" ]] && echo "  🔗 URL     : $ISSUE_URL"
else
  die "Failed to update the status. Response: $RESULT"
fi

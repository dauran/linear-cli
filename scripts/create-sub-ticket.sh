#!/bin/bash
# create-sub-ticket.sh — Creates a Linear sub-ticket with a parent ticket
# Usage: ./scripts/create-sub-ticket.sh <PARENT_TICKET> --title "..." --body "..." --statusId <STATUS_ID>
#   ex: ./scripts/create-sub-ticket.sh DAU-10 --title "My task" --body "Description" --statusId abc-123
#
# The assignee and team will be inherited from the parent ticket.
# Requires the LINEAR_API_KEY variable (or source one of the wrappers
# linear-perso.sh / linear-work.sh before calling this script).

set -euo pipefail

# ── Helpers ───────────────────────────────────────────────────────────────────
die() { echo "❌  $*" >&2; exit 1; }
usage() {
  echo "Usage: $0 <PARENT_TICKET> --title <TITLE> --body <BODY> --statusId <STATUS_ID>"
  echo ""
  echo "  ex: $0 DAU-10 --title \"My task\" --body \"Task description\" --statusId abc-123"
  echo ""
  echo "The assignee and team are inherited from the parent ticket."
  exit 1
}

# ── Validation ────────────────────────────────────────────────────────────────
command -v jq &>/dev/null || die "jq is required (brew install jq)."
[[ $# -lt 1 ]] && usage

# ── Parse arguments ───────────────────────────────────────────────────────────
PARENT_TICKET="$1"
shift

TITLE=""
BODY=""
STATUS_ID=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title)
      [[ $# -lt 2 ]] && die "The --title option requires a value."
      TITLE="$2"
      shift 2
      ;;
    --body)
      [[ $# -lt 2 ]] && die "The --body option requires a value."
      BODY="$2"
      shift 2
      ;;
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

[[ -z "$TITLE" ]]     && die "The title is missing. Use --title <TITLE>."
[[ -z "$BODY" ]]      && die "The body is missing. Use --body <BODY>."
[[ -z "$STATUS_ID" ]] && die "The status is missing. Use --statusId <STATUS_ID>."

# ── Linear binary resolution ──────────────────────────────────────────────
LINEAR_BIN="linear"
if [[ ! -x "$LINEAR_BIN" ]]; then
  LINEAR_BIN="$(command -v linear 2>/dev/null || true)"
  [[ -z "$LINEAR_BIN" ]] && die "Binary 'linear' not found. Compile it with: deno task mac"
fi

run() { "$LINEAR_BIN" "$@" 2>/dev/null; }

# ── Fetch parent ticket ────────────────────────────────────────────────────
echo "🔍 Resolving parent ticket $PARENT_TICKET..."
PARENT_JSON="$(run issue get "$PARENT_TICKET")"
[[ -z "$PARENT_JSON" || "$PARENT_JSON" == "null" ]] && die "Parent ticket '$PARENT_TICKET' not found."

PARENT_ID="$(echo "$PARENT_JSON"   | jq -r '.id')"
PARENT_TITLE="$(echo "$PARENT_JSON" | jq -r '.title // "(no title)"')"
TEAM_ID="$(echo "$PARENT_JSON"     | jq -r '.team.id')"
TEAM_NAME="$(echo "$PARENT_JSON"   | jq -r '.team.name // "unknown"')"
ASSIGNEE_ID="$(echo "$PARENT_JSON" | jq -r '.assignee.id // empty')"
ASSIGNEE_NAME="$(echo "$PARENT_JSON" | jq -r '.assignee.name // "unassigned"')"

echo ""
echo "📋 Parent ticket : [$PARENT_TICKET] $PARENT_TITLE"
echo "   👥 Team       : $TEAM_NAME"
echo "   👤 Assignee   : $ASSIGNEE_NAME"
echo ""
echo "🚀 Creating sub-ticket..."
echo "   📝 Title      : $TITLE"
echo "   📌 Status ID  : $STATUS_ID"
echo ""

# ── Sub-ticket creation ───────────────────────────────────────────────────
CREATE_ARGS=(
  issue create
  --team-id    "$TEAM_ID"
  --parent-id  "$PARENT_ID"
  --title      "$TITLE"
  --description "$BODY"
  --state-id   "$STATUS_ID"
)

# Add the assignee only if the parent has one
if [[ -n "$ASSIGNEE_ID" ]]; then
  CREATE_ARGS+=(--assignee-id "$ASSIGNEE_ID")
fi

RESULT="$(run "${CREATE_ARGS[@]}")"

NEW_ID="$(echo "$RESULT"    | jq -r '.id // empty')"
NEW_NUMBER="$(echo "$RESULT" | jq -r '.identifier // empty')"
NEW_URL="$(echo "$RESULT"   | jq -r '.url // empty')"
NEW_TITLE="$(echo "$RESULT" | jq -r '.title // empty')"

if [[ -n "$NEW_ID" ]]; then
  echo "✅ Sub-ticket successfully created!"
  echo ""
  echo "  🆔 ID         : $NEW_ID"
  [[ -n "$NEW_NUMBER" ]] && echo "  🎫 Number     : $NEW_NUMBER"
  [[ -n "$NEW_TITLE" ]]  && echo "  📝 Title      : $NEW_TITLE"
  echo "  👪 Parent     : [$PARENT_TICKET] $PARENT_TITLE"
  echo "  👥 Team       : $TEAM_NAME"
  echo "  👤 Assignee   : $ASSIGNEE_NAME"
  [[ -n "$NEW_URL" ]] && echo "  🔗 URL        : $NEW_URL"
else
  die "Failed to create the sub-ticket. Response: $RESULT"
fi

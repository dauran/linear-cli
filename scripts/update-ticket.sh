#!/bin/bash
# update-ticket.sh — Updates a Linear ticket
# Usage: ./scripts/update-ticket.sh <TICKET_NUMBER> [--title "..."] [--body "..."] [--appendBody "..."]
#   ex: ./scripts/update-ticket.sh DAU-123 --title "New title"

set -euo pipefail

# ── Helpers ───────────────────────────────────────────────────────────────────
die() { echo "❌  $*" >&2; exit 1; }

# ── Validation ────────────────────────────────────────────────────────────────
command -v jq &>/dev/null || die "jq is required (brew install jq)."
[[ $# -lt 1 ]] && die "Usage: $0 <TICKET_NUMBER> [--title \"...\"] [--body \"...\"] [--appendBody \"...\"]"

TICKET="$1"
shift

HAS_TITLE=0
TITLE=""
HAS_BODY=0
BODY=""
HAS_APPEND_BODY=0
APPEND_BODY=""

while [[ $# -gt 0 ]]; do
  case $1 in
    --title)
      if [[ $# -gt 1 && ! "$2" == --* ]]; then
        TITLE="$2"
        shift 2
      else
        TITLE=""
        shift
      fi
      HAS_TITLE=1
      ;;
    --body)
      if [[ $# -gt 1 && ! "$2" == --* ]]; then
        BODY="$2"
        shift 2
      else
        BODY=""
        shift
      fi
      HAS_BODY=1
      ;;
    --appendBody)
      if [[ $# -gt 1 && ! "$2" == --* ]]; then
        APPEND_BODY="$2"
        shift 2
      else
        APPEND_BODY=""
        shift
      fi
      HAS_APPEND_BODY=1
      ;;
    *)
      # Ignore unknown options
      shift
      ;;
  esac
done

# Linear binary resolution
LINEAR_BIN="linear"
if [[ ! -x "$LINEAR_BIN" ]]; then
  LINEAR_BIN="$(command -v linear 2>/dev/null || true)"
  [[ -z "$LINEAR_BIN" ]] && die "Binary 'linear' not found. Compile it with: deno task mac"
fi

# For silent calls (jq)
run_silent() { "$LINEAR_BIN" "$@" 2>/dev/null; }

# Preparation of arguments for the update command
UPDATE_ARGS=("$TICKET")

if [[ "$HAS_TITLE" -eq 1 ]]; then
  UPDATE_ARGS+=("--title" "$TITLE")
fi

if [[ "$HAS_BODY" -eq 1 || "$HAS_APPEND_BODY" -eq 1 ]]; then
  NEW_DESC=""
  
  if [[ "$HAS_BODY" -eq 1 ]]; then
    NEW_DESC="$BODY"
  else
    # We need to fetch the current body
    ISSUE_JSON="$(run_silent issue get "$TICKET")"
    [[ -z "$ISSUE_JSON" || "$ISSUE_JSON" == "null" ]] && die "Ticket '$TICKET' not found."
    NEW_DESC="$(echo "$ISSUE_JSON" | jq -r '.description // ""')"
  fi

  if [[ "$HAS_APPEND_BODY" -eq 1 ]]; then
    if [[ -z "$NEW_DESC" ]]; then
      NEW_DESC="$APPEND_BODY"
    else
      NEW_DESC="$NEW_DESC
$APPEND_BODY"
    fi
  fi

  UPDATE_ARGS+=("--description" "$NEW_DESC")
fi

# If we only have 1 element (the TICKET), nothing was requested
if [[ ${#UPDATE_ARGS[@]} -eq 1 ]]; then
  echo "⚠️  No attributes to update."
  exit 0
fi

# Update execution
echo "Updating ticket $TICKET..."
"$LINEAR_BIN" issue update "${UPDATE_ARGS[@]}"

echo "✅ Ticket successfully updated."

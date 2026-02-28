#!/bin/bash
# resolve-comment.sh — Marks a Linear comment as resolved
# Usage: ./scripts/resolve-comment.sh --commentId <COMMENT_ID>
#   ex: ./scripts/resolve-comment.sh --commentId 123-456


set -euo pipefail

# ── Helpers ───────────────────────────────────────────────────────────────────
die() { echo "❌  $*" >&2; exit 1; }
usage() {
  echo "Usage: $0 --commentId <COMMENT_ID>"
  echo "  ex:  $0 --commentId 123-456"
  exit 1
}

# ── Validation ────────────────────────────────────────────────────────────────
command -v jq &>/dev/null || die "jq is required (brew install jq)."
[[ $# -lt 1 ]] && usage

# Parse --commentId flag
COMMENT_ID=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --commentId)
      [[ $# -lt 2 ]] && die "The --commentId option requires a value."
      COMMENT_ID="$2"
      shift 2
      ;;
    *)
      die "Unknown option: $1"
      ;;
  esac
done

[[ -z "$COMMENT_ID" ]] && die "The comment ID is missing. Use --commentId <ID>."

# ── Linear binary resolution ─────────────────────────────────────────────
LINEAR_BIN="linear"
if [[ ! -x "$LINEAR_BIN" ]]; then
  LINEAR_BIN="$(command -v linear 2>/dev/null || true)"
  [[ -z "$LINEAR_BIN" ]] && die "Binary 'linear' not found. Compile it with: deno task mac"
fi

run() { "$LINEAR_BIN" "$@" 2>/dev/null; }

# ── Comment resolution ─────────────────────────────────────────────────
echo "🔍 Marking comment $COMMENT_ID as resolved..."

RESULT="$(run comment resolve "$COMMENT_ID")"

UPDATED_ID="$(echo "$RESULT" | jq -r '.id // empty')"
UPDATED_URL="$(echo "$RESULT" | jq -r '.url // empty')"
IS_RESOLVED="$(echo "$RESULT" | jq -r '.resolved // false')"

if [[ -n "$UPDATED_ID" ]]; then
  echo ""
  echo "✅ Comment successfully marked as resolved!"
  echo ""
  echo "  🆔 ID      : $UPDATED_ID"
  [[ -n "$UPDATED_URL" ]] && echo "  🔗 URL     : $UPDATED_URL"
else
  die "Failed to resolve the comment. Response: $RESULT"
fi

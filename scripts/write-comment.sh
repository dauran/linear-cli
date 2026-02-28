#!/bin/bash
# write-comment.sh — Writes a new comment on a Linear ticket
# Usage: ./scripts/write-comment.sh <TICKET_NUMBER> --comment "comment content"
#   ex: ./scripts/write-comment.sh DAU-42 --comment "My comment here"
#
# Requires the LINEAR_API_KEY variable (or source one of the wrappers
# linear-perso.sh / linear-work.sh before calling this script).

set -euo pipefail

# ── Helpers ───────────────────────────────────────────────────────────────────
die() { echo "❌  $*" >&2; exit 1; }
usage() {
  echo "Usage: $0 <TICKET_NUMBER> --comment \"contenu du commentaire\""
  echo "  ex:  $0 DAU-42 --comment \"Mon commentaire ici\""
  exit 1
}

# ── Validation ────────────────────────────────────────────────────────────────
command -v jq &>/dev/null || die "jq is required (brew install jq)."
[[ $# -lt 1 ]] && usage

TICKET="$1"
shift

# Parse --comment flag
COMMENT_BODY=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --comment)
      [[ $# -lt 2 ]] && die "The --comment option requires a value."
      COMMENT_BODY="$2"
      shift 2
      ;;
    *)
      die "Unknown option: $1"
      ;;
  esac
done

[[ -z "$COMMENT_BODY" ]] && die "The comment is empty. Use --comment \"your text\"."

# ── Linear binary resolution ─────────────────────────────────────────────
LINEAR_BIN="linear"
if [[ ! -x "$LINEAR_BIN" ]]; then
  LINEAR_BIN="$(command -v linear 2>/dev/null || true)"
  [[ -z "$LINEAR_BIN" ]] && die "Binary 'linear' not found. Compile it with: deno task mac"
fi

run() { "$LINEAR_BIN" "$@" 2>/dev/null; }

# ── Fetch issue (to get the internal ID) ───────────────────────────────────
echo "🔍 Resolving ticket $TICKET..."
ISSUE_JSON="$(run issue get "$TICKET")"
[[ -z "$ISSUE_JSON" || "$ISSUE_JSON" == "null" ]] && die "Ticket '$TICKET' not found."

ISSUE_ID="$(echo "$ISSUE_JSON" | jq -r '.id')"
ISSUE_TITLE="$(echo "$ISSUE_JSON" | jq -r '.title // "(no title)"')"

echo "📝 Adding a comment on [$TICKET] $ISSUE_TITLE..."

# ── Comment creation ───────────────────────────────────────────────────
RESULT="$(run comment create --issue-id "$ISSUE_ID" --body "$COMMENT_BODY")"

COMMENT_ID="$(echo "$RESULT" | jq -r '.id // empty')"
COMMENT_URL="$(echo "$RESULT" | jq -r '.url // empty')"

if [[ -n "$COMMENT_ID" ]]; then
  echo ""
  echo "✅ Comment successfully created!"
  echo ""
  echo "  🆔 ID      : $COMMENT_ID"
  [[ -n "$COMMENT_URL" ]] && echo "  🔗 URL     : $COMMENT_URL"
  echo "  💬 Content : $COMMENT_BODY"
else
  die "Failed to create the comment. Response: $RESULT"
fi

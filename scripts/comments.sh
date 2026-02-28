#!/bin/bash
# comments.sh — Displays Linear ticket comments in hierarchical Markdown
# Usage: ./scripts/comments.sh <TICKET_NUMBER>
#   ex: ./scripts/comments.sh DAU-42
#
# Requires the LINEAR_API_KEY variable (or source one of the wrappers
# linear-perso.sh / linear-work.sh before calling this script).

set -euo pipefail

# ── Helpers ───────────────────────────────────────────────────────────────────
die() { echo "❌  $*" >&2; exit 1; }

# ── Validation ────────────────────────────────────────────────────────────────
command -v jq &>/dev/null || die "jq is required (brew install jq)."
[[ $# -lt 1 ]] && die "Usage: $0 <TICKET_NUMBER>  (ex: DAU-42)"

TICKET="$1"

# Linear binary resolution
LINEAR_BIN="linear"
if [[ ! -x "$LINEAR_BIN" ]]; then
  LINEAR_BIN="$(command -v linear 2>/dev/null || true)"
  [[ -z "$LINEAR_BIN" ]] && die "Binary 'linear' not found. Compile it with: deno task mac"
fi

run() { "$LINEAR_BIN" "$@" 2>/dev/null; }

# ── Fetch issue (to get internal ID) ───────────────────────────────────
ISSUE_JSON="$(run issue get "$TICKET")"
[[ -z "$ISSUE_JSON" || "$ISSUE_JSON" == "null" ]] && die "Ticket '$TICKET' not found."

ISSUE_ID="$(echo "$ISSUE_JSON" | jq -r '.id')"

# ── Fetch comments ────────────────────────────────────────────────────────
COMMENTS_JSON="$(run comment list --issue-id "$ISSUE_ID" --first 200)"
COUNT="$(echo "$COMMENTS_JSON" | jq 'length')"

# ── Header ───────────────────────────────────────────────────────────────────
echo "# Comments — $TICKET"
echo ""
echo "> **$COUNT** comment(s) in total"
echo ""

if [[ "$COUNT" -eq 0 ]]; then
  echo "_No comments for this ticket._"
  exit 0
fi

# ── Hierarchical rendering ────────────────────────────────────────────────────────
# We use a tmp file to build the hierarchy in jq
TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT
echo "$COMMENTS_JSON" > "$TMP_FILE"

# Function that renders a comment (level given by a heading prefix)
render_comment() {
  local json="$1"
  local level="$2"  # "##" pour top-level, "###" pour réponses

  local id author body created_at resolved_at resolved_label resolved_icon

  id="$(echo "$json" | jq -r '.id')"
  author="$(echo "$json" | jq -r 'if .user then .user.name else "(unknown)" end')"
  body="$(echo "$json" | jq -r '.body // "(empty)"')"
  created_at="$(echo "$json" | jq -r '.createdAt // ""')"
  resolved_at="$(echo "$json" | jq -r '.resolvedAt // ""')"

  if [[ -n "$resolved_at" ]]; then
    resolved_icon="✅"
    resolved_label="Resolved on \`$resolved_at\`"
  else
    resolved_icon="🔵"
    resolved_label="Unresolved"
  fi

  echo "$level $resolved_icon **$author**"
  echo ""
  echo "> **ID** : \`$id\`  "
  echo "> **Date**   : \`$created_at\`  "
  echo "> **Status** : $resolved_label"
  echo ""
  # Indent the body to make it readable as a Markdown block
  echo "$body" | sed 's/^/> /'
  echo ""
}

# Extract root comments (parentId == null)
ROOT_IDS="$(jq -r '[.[] | select(.parentId == null)] | sort_by(.createdAt) | .[].id' "$TMP_FILE")"

if [[ -z "$ROOT_IDS" ]]; then
  echo "_No root comments found._"
  exit 0
fi

echo "---"
echo ""

while IFS= read -r root_id; do
  ROOT_COMMENT="$(jq --arg id "$root_id" '.[] | select(.id == $id)' "$TMP_FILE")"

  render_comment "$ROOT_COMMENT" "##"

  # Search for replies (direct children)
  CHILD_IDS="$(jq -r --arg pid "$root_id" '[.[] | select(.parentId == $pid)] | sort_by(.createdAt) | .[].id' "$TMP_FILE")"

  if [[ -n "$CHILD_IDS" ]]; then
    echo "### Replies:*"
    echo ""
    while IFS= read -r child_id; do
      CHILD_COMMENT="$(jq --arg id "$child_id" '.[] | select(.id == $id)' "$TMP_FILE")"
      render_comment "$CHILD_COMMENT" "####"
    done <<< "$CHILD_IDS"
  fi

  echo "---"
  echo ""
done <<< "$ROOT_IDS"

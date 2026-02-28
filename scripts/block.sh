#!/bin/bash
# block.sh — Manages blocking relations between Linear tickets
# Usage:
#   ./scripts/block.sh <TICKET_A> --blocks    <TICKET_B>   → A blocks B
#   ./scripts/block.sh <TICKET_A> --blocked-by <TICKET_B>  → A is blocked by B
#   ./scripts/block.sh <TICKET_A> --unblocks   <TICKET_B>  → Removes "A blocks B"
#   ./scripts/block.sh <TICKET_A> --unblocked-by <TICKET_B> → Removes "B blocks A"
#
#   ex: ./scripts/block.sh DAU-10 --blocks     DAU-42
#       ./scripts/block.sh DAU-42 --blocked-by  DAU-10
#       ./scripts/block.sh DAU-10 --unblocks    DAU-42
#       ./scripts/block.sh DAU-42 --unblocked-by DAU-10
#
# Requires the LINEAR_API_KEY variable (or source one of the wrappers
# linear-perso.sh / linear-work.sh before calling this script).

set -euo pipefail

# ── Helpers ───────────────────────────────────────────────────────────────────
die() { echo "❌  $*" >&2; exit 1; }
usage() {
  echo "Usage:"
  echo "  $0 <TICKET_A> --blocks      <TICKET_B>  # Create: A blocks B"
  echo "  $0 <TICKET_A> --blocked-by  <TICKET_B>  # Create: A is blocked by B"
  echo "  $0 <TICKET_A> --unblocks    <TICKET_B>  # Remove: A blocks B"
  echo "  $0 <TICKET_A> --unblocked-by <TICKET_B> # Remove: A is blocked by B"
  echo ""
  echo "Examples:"
  echo "  $0 DAU-10 --blocks      DAU-42   → DAU-10 blocks DAU-42"
  echo "  $0 DAU-42 --blocked-by  DAU-10   → DAU-42 is blocked by DAU-10"
  echo "  $0 DAU-10 --unblocks    DAU-42   → Removes the blocking relation"
  echo "  $0 DAU-42 --unblocked-by DAU-10  → Removes the blocking relation"
  exit 1
}

# ── Validation ────────────────────────────────────────────────────────────────
command -v jq &>/dev/null || die "jq is required (brew install jq)."
[[ $# -lt 3 ]] && usage

# ── Parse arguments ───────────────────────────────────────────────────────────
TICKET_A="$1"

MODE=""
case "$2" in
  --blocks)       MODE="blocks"      ;;
  --blocked-by)   MODE="blocked-by"  ;;
  --unblocks)     MODE="unblocks"    ;;
  --unblocked-by) MODE="unblocked-by";;
  *) usage ;;
esac

TICKET_B="$3"

# ── Linear binary resolution ──────────────────────────────────────────────
LINEAR_BIN="linear"
if [[ ! -x "$LINEAR_BIN" ]]; then
  LINEAR_BIN="$(command -v linear 2>/dev/null || true)"
  [[ -z "$LINEAR_BIN" ]] && die "Binary 'linear' not found. Compile it with: deno task mac"
fi

run() { "$LINEAR_BIN" "$@" 2>/dev/null; }

# ── Fetch issue A ─────────────────────────────────────────────────────────────
echo "🔍 Resolving ticket $TICKET_A..."
ISSUE_A_JSON="$(run issue get "$TICKET_A")"
[[ -z "$ISSUE_A_JSON" || "$ISSUE_A_JSON" == "null" ]] && die "Ticket '$TICKET_A' not found."

ISSUE_A_ID="$(echo "$ISSUE_A_JSON" | jq -r '.id')"
ISSUE_A_TITLE="$(echo "$ISSUE_A_JSON" | jq -r '.title // "(no title)"')"
ISSUE_A_STATE="$(echo "$ISSUE_A_JSON" | jq -r '.state.name // "unknown"')"

# ── Fetch issue B ─────────────────────────────────────────────────────────────
echo "🔍 Resolving ticket $TICKET_B..."
ISSUE_B_JSON="$(run issue get "$TICKET_B")"
[[ -z "$ISSUE_B_JSON" || "$ISSUE_B_JSON" == "null" ]] && die "Ticket '$TICKET_B' not found."

ISSUE_B_ID="$(echo "$ISSUE_B_JSON" | jq -r '.id')"
ISSUE_B_TITLE="$(echo "$ISSUE_B_JSON" | jq -r '.title // "(no title)"')"
ISSUE_B_STATE="$(echo "$ISSUE_B_JSON" | jq -r '.state.name // "unknown"')"

# ── Determines blocker / blocked according to the mode ─────────────────────────────────
# --blocks / --unblocks    : A is the blocker, B is blocked
# --blocked-by / --unblocked-by : B is the blocker, A is blocked
if [[ "$MODE" == "blocks" || "$MODE" == "unblocks" ]]; then
  BLOCKER_TICKET="$TICKET_A"; BLOCKER_ID="$ISSUE_A_ID"; BLOCKER_TITLE="$ISSUE_A_TITLE"; BLOCKER_STATE="$ISSUE_A_STATE"
  BLOCKED_TICKET="$TICKET_B"; BLOCKED_ID="$ISSUE_B_ID"; BLOCKED_TITLE="$ISSUE_B_TITLE"; BLOCKED_STATE="$ISSUE_B_STATE"
else
  BLOCKER_TICKET="$TICKET_B"; BLOCKER_ID="$ISSUE_B_ID"; BLOCKER_TITLE="$ISSUE_B_TITLE"; BLOCKER_STATE="$ISSUE_B_STATE"
  BLOCKED_TICKET="$TICKET_A"; BLOCKED_ID="$ISSUE_A_ID"; BLOCKED_TITLE="$ISSUE_A_TITLE"; BLOCKED_STATE="$ISSUE_A_STATE"
fi

# ── Summary display ───────────────────────────────────────────────────────
echo ""
if [[ "$MODE" == "blocks" || "$MODE" == "blocked-by" ]]; then
  echo "🔗 Creating blocking relation:"
else
  echo "🗑️  Removing blocking relation:"
fi
echo ""
echo "  🚫 Blocker   : [$BLOCKER_TICKET] $BLOCKER_TITLE  (status: $BLOCKER_STATE)"
echo "  ⏸️  Blocked   : [$BLOCKED_TICKET] $BLOCKED_TITLE  (status: $BLOCKED_STATE)"
echo ""

# ── Creation ─────────────────────────────────────────────────────────────────
if [[ "$MODE" == "blocks" || "$MODE" == "blocked-by" ]]; then
  echo "  → [$BLOCKED_TICKET] can only be executed if [$BLOCKER_TICKET] is resolved."
  echo ""

  RESULT="$(run issue-relation create \
    --issue-id "$BLOCKER_ID" \
    --related-issue-id "$BLOCKED_ID" \
    --type blocks)"

  RELATION_ID="$(echo "$RESULT" | jq -r '.id // empty')"
  RELATION_TYPE="$(echo "$RESULT" | jq -r '.type // empty')"

  if [[ -n "$RELATION_ID" ]]; then
    echo "✅ Relation successfully created!"
    echo ""
    echo "  🆔 Relation ID : \`$RELATION_ID\`"
    echo "  📌 Type        : $RELATION_TYPE"
  else
    die "Failed to create the relation. Response: $RESULT"
  fi

# ── Deletion ───────────────────────────────────────────────────────────────
else
  echo "🔎 Searching for the blocking relation..."

  RELATIONS_JSON="$(run issue-relation list --first 250)"

  # Search for the relation where issue.id == BLOCKER and relatedIssue.id == BLOCKED
  RELATION_ID="$(echo "$RELATIONS_JSON" | jq -r --arg blocker "$BLOCKER_ID" --arg blocked "$BLOCKED_ID" '
    .[] | select(
      .type == "blocks" and
      .issue.id == $blocker and
      .relatedIssue.id == $blocked
    ) | .id
  ' | head -1)"

  if [[ -z "$RELATION_ID" ]]; then
    die "No blocking relation found between [$BLOCKER_TICKET] and [$BLOCKED_TICKET]."
  fi

  echo "  🆔 Relation found: \`$RELATION_ID\`"
  echo ""

  run issue-relation delete "$RELATION_ID" > /dev/null

  echo "✅ Relation successfully removed!"
  echo ""
  echo "  [$BLOCKED_TICKET] is no longer blocked by [$BLOCKER_TICKET]."
fi

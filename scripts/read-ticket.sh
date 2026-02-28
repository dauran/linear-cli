#!/bin/bash
# read-ticket.sh — Displays key infos of a Linear ticket in Markdown
# Usage: ./scripts/read-ticket.sh <TICKET_NUMBER>
#   ex: ./scripts/read-ticket.sh ENG-42
#

set -euo pipefail

# ── Helpers ───────────────────────────────────────────────────────────────────
die() { echo "❌  $*" >&2; exit 1; }

# ── Validation ────────────────────────────────────────────────────────────────
command -v jq &>/dev/null || die "jq is required (brew install jq)."
[[ $# -lt 1 ]] && die "Usage: $0 <TICKET_NUMBER>  (ex: ENG-42)"

TICKET="$1"

# Linear binary resolution
LINEAR_BIN="linear"
if [[ ! -x "$LINEAR_BIN" ]]; then
  LINEAR_BIN="$(command -v linear 2>/dev/null || true)"
  [[ -z "$LINEAR_BIN" ]] && die "Binary 'linear' not found. Compile it with: deno task mac"
fi

run() { "$LINEAR_BIN" "$@" 2>/dev/null; }

# ── Fetch ──────────────────────────────────────────────────────────────────────
ISSUE_JSON="$(run issue get "$TICKET")"
[[ -z "$ISSUE_JSON" || "$ISSUE_JSON" == "null" ]] && die "Ticket '$TICKET' not found."

TEAM_ID="$(echo "$ISSUE_JSON"   | jq -r '.team.id')"
TEAM_NAME="$(echo "$ISSUE_JSON" | jq -r '.team.name')"

ME_JSON="$(run user get me)"
STATES_JSON="$(run workflow-state list --team "$TEAM_ID")"

# ── Logged in user ───────────────────────────────────────────────────────
echo "## Logged in user"
echo ""
echo "| Field  | Value |"
echo "|--------|-------|"
echo "| userId | \`$(echo "$ME_JSON" | jq -r '.id')\` |"
echo "| Name   | $(echo "$ME_JSON" | jq -r '.name') |"

# ── Team ───────────────────────────────────────────────────────────────────────
echo ""
echo "## Team"
echo ""
echo "| Field  | Value |"
echo "|--------|-------|"
echo "| teamId | \`$TEAM_ID\` |"
echo "| Name   | $TEAM_NAME |"

# ── Available states ──────────────────────────────────────────────────────────
echo ""
echo "## Available states — $TEAM_NAME"
echo ""
echo "| Name | Type | stateId |"
echo "|------|------|---------|"
echo "$STATES_JSON" | jq -r '
  sort_by(.position)[] |
  "| \(.name) | \(.type) | `\(.id)` |"
'

# ── Issue ─────────────────────────────────────────────────────────────────────
echo ""
echo "## Issue — $TICKET"
echo ""
echo "| Field      | Value |"
echo "|------------|-------|"
echo "| Internal ID| \`$(echo "$ISSUE_JSON" | jq -r '.id')\` |"
echo "| Number     | **$(echo "$ISSUE_JSON" | jq -r '.identifier')** |"
echo "| Title      | $(echo "$ISSUE_JSON" | jq -r '.title') |"
echo "| State      | $(echo "$ISSUE_JSON" | jq -r '.state.name') (\`$(echo "$ISSUE_JSON" | jq -r '.state.id')\`) |"

# Parent
echo ""
echo "### Parent"
echo ""
PARENT="$(echo "$ISSUE_JSON" | jq -r '.parent')"
if [[ "$PARENT" == "null" ]]; then
  echo "_No parent_"
else
  echo "| Internal ID| Number | Title | State |"
  echo "|------------|--------|-------|-------|"
  echo "$ISSUE_JSON" | jq -r '"| `\(.parent.id)` | \(.parent.identifier) | \(.parent.title) | \(.parent.state.name) |"'
fi

# Children
echo ""
echo "### Children"
echo ""
CHILDREN_COUNT="$(echo "$ISSUE_JSON" | jq '.children | length')"
if [[ "$CHILDREN_COUNT" -eq 0 ]]; then
  echo "_No children_"
else
  echo "| Internal ID| Number | Title | State |"
  echo "|------------|--------|-------|-------|"
  echo "$ISSUE_JSON" | jq -r '.children[] | "| `\(.id)` | \(.identifier) | \(.title) | \(.state.name) |"'
fi

# Blocked by (inverseRelations of type "blocks")
echo ""
echo "### Blocked by"
echo ""
BLOCKED_BY_COUNT="$(echo "$ISSUE_JSON" | jq '[(.inverseRelations // [])[] | select(.type == "blocks")] | length')"
if [[ "$BLOCKED_BY_COUNT" -eq 0 ]]; then
  echo "_Not blocked_"
else
  echo "| Internal ID| Number | Title | State |"
  echo "|------------|--------|-------|-------|"
  echo "$ISSUE_JSON" | jq -r '(.inverseRelations // [])[] | select(.type == "blocks") | "| `\(.issue.id)` | \(.issue.identifier) | \(.issue.title) | \(.issue.state.name) |"'
fi

# Blocks (relations of type "blocks")
echo ""
echo "### Blocks"
echo ""
BLOCKS_COUNT="$(echo "$ISSUE_JSON" | jq '[(.relations // [])[] | select(.type == "blocks")] | length')"
if [[ "$BLOCKS_COUNT" -eq 0 ]]; then
  echo "_Does not block any tickets_"
else
  echo "| Internal ID| Number | Title | State |"
  echo "|------------|--------|-------|-------|"
  echo "$ISSUE_JSON" | jq -r '(.relations // [])[] | select(.type == "blocks") | "| `\(.relatedIssue.id)` | \(.relatedIssue.identifier) | \(.relatedIssue.title) | \(.relatedIssue.state.name) |"'
fi

echo ""
echo "### Description"
echo ""
echo "---"
echo ""
echo "$ISSUE_JSON" | jq -r '.description // "(no description)"'
echo ""
echo "---"


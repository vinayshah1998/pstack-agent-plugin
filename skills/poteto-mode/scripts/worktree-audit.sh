#!/usr/bin/env bash
set -u

repo="${1:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -z "$repo" ] && { echo "not in a git repo; pass a repo path" >&2; exit 1; }
cd "$repo" || exit 1

have_jq=true
if ! command -v jq >/dev/null 2>&1; then
  echo "warn: jq is unavailable; PR correlation will be omitted" >&2
  have_jq=false
fi

main_wt=$(git worktree list --porcelain | sed -n 's/^worktree //p' | head -1)
git fetch origin main --quiet 2>/dev/null || echo "warn: could not fetch origin/main; merged column may be stale" >&2

prs=$(mktemp)
trap 'rm -f "$prs"' EXIT INT TERM
gh pr list --author "@me" --state all --limit 1000 \
  --json number,state,headRefName 2>/dev/null > "$prs" || echo "[]" > "$prs"

transcripts="${PSTACK_TRANSCRIPTS_DIR:-}"
if [ -n "$transcripts" ] && ! command -v rg >/dev/null 2>&1; then
  echo "warn: rg is unavailable; transcript correlation will be omitted" >&2
  transcripts=""
fi
now=$(date +%s)

file_mtime() {
  stat -f '%m' "$1" 2>/dev/null || stat -c '%Y' "$1" 2>/dev/null
}

format_day() {
  date -r "$1" '+%Y-%m-%d' 2>/dev/null || date -d "@$1" '+%Y-%m-%d' 2>/dev/null
}

printf "SIZE\tAGE\tMERGED\tDIRTY\tREMOTE\tPR\tLAST_CHAT\tBUCKET\tWORKTREE\n"

git worktree list --porcelain | sed -n 's/^worktree //p' | while IFS= read -r wt; do
  [ "$wt" = "$main_wt" ] && continue

  size=$(du -sh "$wt" 2>/dev/null | awk '{print $1}')
  head=$(git -C "$wt" rev-parse HEAD 2>/dev/null)
  head_ts=$(git -C "$wt" log -1 --format='%ct' HEAD 2>/dev/null || echo 0)
  age=$([ "$head_ts" -gt 0 ] 2>/dev/null && echo "$(( (now - head_ts) / 86400 ))d" || echo "?")

  git merge-base --is-ancestor "$head" origin/main 2>/dev/null && merged=YES || merged=no

  porcelain=$(git -C "$wt" status --porcelain 2>/dev/null)
  if [ -z "$porcelain" ]; then
    dirty=clean
  elif printf '%s\n' "$porcelain" | grep -qv '^??'; then
    dirty="wip:$(printf '%s\n' "$porcelain" | grep -cv '^??')"
  else
    dirty="scratch:$(printf '%s\n' "$porcelain" | grep -c '^??')"
  fi

  branch=$(git -C "$wt" symbolic-ref --quiet --short HEAD 2>/dev/null || echo "")
  if [ -z "$branch" ]; then
    remote=detached
  elif git -C "$wt" show-ref --verify --quiet "refs/remotes/origin/$branch"; then
    if [ "$(git -C "$wt" rev-parse "origin/$branch" 2>/dev/null)" = "$head" ]; then
      remote=pushed
    else
      remote="ahead$(git -C "$wt" rev-list --count "origin/$branch..HEAD" 2>/dev/null)"
    fi
  else
    remote=no-remote
  fi

  pr="-"
  if [ "$have_jq" = true ] && [ -n "$branch" ]; then
    pr=$(jq -r --arg b "$branch" \
      '.[] | select(.headRefName==$b) | "#\(.number)/\(.state)"' "$prs" 2>/dev/null | head -1)
    [ -z "$pr" ] && pr="-"
  fi

  last="-"
  last_ts=0
  if [ -n "$transcripts" ] && [ -d "$transcripts" ]; then
    while IFS= read -r -d '' transcript; do
      timestamp=$(file_mtime "$transcript")
      if [ -n "$timestamp" ] && [ "$timestamp" -gt "$last_ts" ] 2>/dev/null; then
        last_ts=$timestamp
      fi
    done < <(rg -l -0 -e "${wt}/" -e "${wt}\"" "$transcripts" 2>/dev/null)
    if [ "$last_ts" -gt 0 ] 2>/dev/null; then
      last=$(format_day "$last_ts")
    fi
  fi
  recent=$([ "$last_ts" -gt 0 ] 2>/dev/null && [ $(( (now - last_ts) / 86400 )) -le 4 ] && echo yes || echo no)

  case "$dirty" in
    wip:*) bucket=hold-wip ;;
    *)
      case "$pr" in
        *OPEN*) bucket=hold-open-pr ;;
        *)
          if [ "$recent" = yes ]; then bucket=verify-recent-chat
          elif [ "$merged" = YES ] || [ "$pr" != "-" ]; then bucket=safe
          else bucket=review
          fi
          ;;
      esac
      ;;
  esac

  printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
    "$size" "$age" "$merged" "$dirty" "$remote" "$pr" "$last" "$bucket" "$wt"
done | sort -t$'\t' -k1,1 -rh

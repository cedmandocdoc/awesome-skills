#!/usr/bin/env bash
# Probe the SUPABASE_ACCESS_TOKEN repository secret for every permission the deploy needs.
#
# Usage, from the repository root: probe-ci-token.sh <project-ref> [api] [db] [storage]
# The extra words add the Read-write rows for production-block sections that config.toml declares.
#
# Pushes a throwaway branch whose only file is a workflow that calls one Management API request
# per permission row in ../assets/ci-token-permissions.tsv with the secret, and prints status codes
# only. Write rows send a wrong-typed body or a random missing name, so nothing changes.
# Then deletes the run and the branch.
#
# Exit 0: every permission granted. 1: a permission is missing or the secret is unset. 2: the probe failed to run.

set -euo pipefail

[ $# -ge 1 ] || { echo "usage: $0 <project-ref> [api] [db] [storage]" >&2; exit 2; }
ref=$1; shift
tags=" always $* "
here=$(cd "$(dirname "$0")" && pwd)
table="$here/../assets/ci-token-permissions.tsv"
rand=$(od -An -N4 -tx1 /dev/urandom | tr -d ' \n')
branch="probe/supabase-ci-token-$rand"

workflow=$(mktemp)
trap 'rm -f "$workflow"' EXIT
{
  cat <<'YAML'
name: Probe SUPABASE_ACCESS_TOKEN
on: push
permissions: {}
jobs:
  probe:
    runs-on: ubuntu-latest
    steps:
      - name: Probe
        env:
          TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
        run: |
          if [ -z "$TOKEN" ]; then echo "PROBE|unset|-|000"; exit 0; fi
          probe() {
            code=$(curl -s -o /dev/null -w '%{http_code}' -X "$3" -H "Authorization: Bearer $TOKEN" \
              -H 'Content-Type: application/json' ${5:+--data "$5"} "https://api.supabase.com$4")
            echo "PROBE|$1|$2|$code"
          }
YAML
  tail -n +2 "$table" | while IFS=$'\t' read -r permission level when method path body _; do
    case "$tags" in *" $when "*) ;; *) continue ;; esac
    path=${path//\{ref\}/$ref}; path=${path//\{rand\}/$rand}
    body=${body//\{rand\}/$rand}
    [ "$body" = "-" ] && body=""
    printf "          probe '%s' '%s' %s '%s' '%s'\n" "$permission" "$level" "$method" "$path" "$body"
  done
} > "$workflow"

blob=$(git hash-object -w "$workflow")
tree=$(printf '100644 blob %s\tprobe.yml\n' "$blob" | git mktree)
tree=$(printf '040000 tree %s\tworkflows\n' "$tree" | git mktree)
tree=$(printf '040000 tree %s\t.github\n' "$tree" | git mktree)
commit=$(git commit-tree "$tree" -m "chore: probe SUPABASE_ACCESS_TOKEN")
git push -q origin "$commit:refs/heads/$branch"
trap 'rm -f "$workflow"; git push -q origin --delete "$branch" >/dev/null 2>&1 || true' EXIT

run=""
for _ in $(seq 40); do
  run=$(gh run list --branch "$branch" --json databaseId --jq '.[0].databaseId // empty')
  [ -n "$run" ] && break
  sleep 3
done
[ -n "$run" ] || { echo "No probe run started on $branch; check that GitHub Actions is enabled" >&2; exit 2; }
gh run watch "$run" >/dev/null 2>&1 || true
results=$(gh run view "$run" --log | grep -oE 'PROBE\|[^|]+\|[^|]+\|[0-9]{3}$' || true)
gh run delete "$run" >/dev/null 2>&1 || true

[ -n "$results" ] || { echo "Probe run $run printed no results" >&2; exit 2; }
if [ "$results" = "PROBE|unset|-|000" ]; then
  echo "SUPABASE_ACCESS_TOKEN is not set as a repository secret"
  exit 1
fi

total=0; granted=0; failed=0
while IFS='|' read -r _ permission level code; do
  total=$((total + 1))
  case "$code" in
    401|403) state="missing" ;;
    2??|4??) state="granted"; granted=$((granted + 1)) ;;
    *) state="error ($code)"; failed=1 ;;
  esac
  printf '%-24s %-11s %s\n' "$permission" "$level" "$state"
done <<< "$results"
echo "$granted of $total permissions granted"

[ "$failed" -eq 0 ] || exit 2
[ "$granted" -eq "$total" ] || exit 1

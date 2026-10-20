#!/usr/bin/env bash
# Probe the CLOUDFLARE_API_TOKEN repository secret for every permission the deploy needs.
#
# Usage, from the repository root: probe-ci-token.sh <account-id> [d1] [kv] [r2] [routes=<zone>]
# The extra words add the rows for what the wrangler config has; routes=<zone> once per zone with routes or custom domains.
#
# Pushes a throwaway branch whose only file is a workflow that calls one Cloudflare API request
# per permission row in ../assets/ci-token-permissions.tsv with the secret, and prints status codes
# only. Each request deletes a random name that does not exist, so nothing changes.
# Then deletes the run and the branch.
#
# Exit 0: every permission granted. 1: a permission is missing or the secret is unset. 2: the probe failed to run.

set -euo pipefail

[ $# -ge 1 ] || { echo "usage: $0 <account-id> [d1] [kv] [r2] [routes=<zone>]" >&2; exit 2; }
account=$1; shift
tags=" always "; zones=""
for arg in "$@"; do
  case "$arg" in
    routes=*) zones="$zones ${arg#routes=}" ;;
    *) tags="$tags$arg " ;;
  esac
done
here=$(cd "$(dirname "$0")" && pwd)
table="$here/../assets/ci-token-permissions.tsv"
hex() { od -An -N"$1" -tx1 /dev/urandom | tr -d ' \n'; }
rand=$(hex 4); rand32=$(hex 16); u=$(hex 16)
uuid="${u:0:8}-${u:8:4}-4${u:13:3}-a${u:17:3}-${u:20:12}"
branch="probe/cloudflare-ci-token-$rand"

rows() {
  tail -n +2 "$table" | while IFS=$'\t' read -r permission level when method path _ _; do
    [ "$when" = "$1" ] || continue
    path=${path//\{account\}/$account}; path=${path//\{rand\}/$rand}
    path=${path//\{rand32\}/$rand32}; path=${path//\{uuid\}/$uuid}
    path=${path//\{zone_id\}/\$zone_id}
    printf '          probe "%s" "%s" %s "%s"\n' "$permission" "$level" "$method" "$path"
  done
}

workflow=$(mktemp)
trap 'rm -f "$workflow"' EXIT
{
  cat <<'YAML'
name: Probe CLOUDFLARE_API_TOKEN
on: push
permissions: {}
jobs:
  probe:
    runs-on: ubuntu-latest
    steps:
      - name: Probe
        env:
          TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        run: |
          if [ -z "$TOKEN" ]; then echo "PROBE|unset|-|000"; exit 0; fi
          api=https://api.cloudflare.com/client/v4
          probe() {
            code=$(curl -s -o /dev/null -w '%{http_code}' -X "$3" -H "Authorization: Bearer $TOKEN" "$api$4")
            echo "PROBE|$1|$2|$code"
          }
YAML
  for tag in $tags; do rows "$tag"; done
  for zone in $zones; do
    printf '          zone_id=$(curl -s -H "Authorization: Bearer $TOKEN" "$api/zones?name=%s" | jq -r ".result[0].id // empty")\n' "$zone"
    printf '          if [ -z "$zone_id" ]; then echo "PROBE|Zone › Workers Routes (%s)|Edit|403"; else\n' "$zone"
    rows routes
    printf '          fi\n'
  done
} > "$workflow"

blob=$(git hash-object -w "$workflow")
tree=$(printf '100644 blob %s\tprobe.yml\n' "$blob" | git mktree)
tree=$(printf '040000 tree %s\tworkflows\n' "$tree" | git mktree)
tree=$(printf '040000 tree %s\t.github\n' "$tree" | git mktree)
commit=$(git commit-tree "$tree" -m "chore: probe CLOUDFLARE_API_TOKEN")
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
  echo "CLOUDFLARE_API_TOKEN is not set as a repository secret"
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
  printf '%-36s %-5s %s\n' "$permission" "$level" "$state"
done <<< "$results"
echo "$granted of $total permissions granted"

[ "$failed" -eq 0 ] || exit 2
[ "$granted" -eq "$total" ] || exit 1

#!/usr/bin/env bash
set -euo pipefail
cd /home/node/.openclaw/workspace/badgehub-app
BASE=$(git rev-parse main~100)
for BR in splitwise-hist-100-v4 splitwise-hist-100-v5; do
  read NA ND NT < <(git log --numstat --format=tformat: "$BASE..$BR" | awk 'NF==3 {a+=$1; d+=$2} END{print a+0, d+0, a+d}')
  MC=$(git log --format=%H --grep='^refactor(rename-decl):\|^chore(rename-propagation):\|^chore(import-propagation):\|^style(formatting):' "$BASE..$BR")
  TMP=$(mktemp)
  if [ -n "$MC" ]; then
    for c in $MC; do git show --numstat --format=tformat: "$c"; done > "$TMP"
    read MA MD MT < <(awk 'NF==3 {a+=$1; d+=$2} END{print a+0, d+0, a+d}' "$TMP")
  else
    MA=0;MD=0;MT=0
  fi
  rm -f "$TMP"
  REM=$((NT-MT))
  echo "$BR total=$NT mech=$MT remain=$REM"
  echo "  commits: rename_decl=$(git log --oneline --grep='^refactor(rename-decl):' $BASE..$BR | wc -l) rename_prop=$(git log --oneline --grep='^chore(rename-propagation):' $BASE..$BR | wc -l) import_prop=$(git log --oneline --grep='^chore(import-propagation):' $BASE..$BR | wc -l) style=$(git log --oneline --grep='^style(formatting):' $BASE..$BR | wc -l)"
done

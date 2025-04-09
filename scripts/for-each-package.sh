#!/bin/sh

set -e

cd "$(dirname "$0")/.."
start_dir="./packages"
cmd="$@"

per_package() {
  (cd "$1" && echo ">> Running in $1" && sh -c "$cmd")
}

for dir1 in "$start_dir"/*/; do
  [ -d "$dir1" ] || continue
  for dir2 in "$dir1"*/; do
    [ -d "$dir2" ] || continue
    for dir3 in "$dir2"*/; do
      [ -d "$dir3" ] || continue
      if [ -f "$dir3/package.json" ]; then
        per_package "$dir3"
      fi
    done
  done
done

#!/bin/sh

set -e

cd "$(dirname "$0")/.."
start_dir="./packages"
cmd="$@"

per_package() {
  (cd "$1" && echo ">> Running in $1" && sh -c "$cmd")
}

while IFS= read -r package; do
  package=$(echo "$package" | tr -d '\r')
  per_package "$package"
done < packages.txt

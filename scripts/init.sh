#!/bin/sh

set -e

cd "$(dirname "$0")/.."

while IFS= read -r package; do
  echo "Initializing $package"
  (cd "$package" && npm i)
  (cd "$package" && npm run build) || echo "Failed to build $package"
done < packages.txt

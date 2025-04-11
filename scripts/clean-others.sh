#!/bin/sh

set -e

git ls-files -o | grep -v node_modules | xargs rm
find . -type d -empty -delete

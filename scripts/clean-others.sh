#!/bin/sh

set -e

git ls-files -o | xargs rm -f
find . -type d -empty -delete

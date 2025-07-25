#!/bin/sh

set -e

cd "$(dirname "$0")/.."

yarn install

# see /Justfile
yarn workspace @this-project/development-util-args run build
yarn workspace @this-project/util-atomic-env run build
yarn workspace @this-project/util-atomic-event-bus run build
yarn workspace @this-project/util-atomic-throttled-pool run build
yarn workspace @this-project/util-atomic-unwrap-non-nullable run build
yarn workspace @this-project/development-scripts-task run build

yarn run task build

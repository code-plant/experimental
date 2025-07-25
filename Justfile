usage:
  sh scripts/usage.sh

init:
  just install
  just build-init-deps
  just build

install:
  yarn install

build:
  yarn run task build

test:
  yarn run task test

clean:
  sh scripts/clean-others.sh

dev:
  yarn workspace @this-project/development-scripts-generate-build-json run start
  yarn workspace @this-project/development-scripts-list-packages-topo-order run start

task name:
  yarn run task {{name}}


# build task and its dependencies
# change scripts/init-without-just.sh if below changes
build-init-deps: build-init-deps-development-util-args build-init-deps-util-atomic-env build-init-deps-util-atomic-event-bus build-init-deps-util-atomic-throttled-pool build-init-deps-util-atomic-unwrap-non-nullable build-init-deps-development-scripts-task
build-init-deps-development-util-args:
  yarn workspace @this-project/development-util-args run build
build-init-deps-util-atomic-env:
  yarn workspace @this-project/util-atomic-env run build
build-init-deps-util-atomic-event-bus:
  yarn workspace @this-project/util-atomic-event-bus run build
build-init-deps-util-atomic-throttled-pool: build-init-deps-util-atomic-event-bus
  yarn workspace @this-project/util-atomic-throttled-pool run build
build-init-deps-util-atomic-unwrap-non-nullable:
  yarn workspace @this-project/util-atomic-unwrap-non-nullable run build
build-init-deps-development-scripts-task:
  yarn workspace @this-project/development-scripts-task run build

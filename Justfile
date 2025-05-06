default: init
  sh scripts/usage.sh

init:
  just install
  just build

install:
  yarn install

build:
  yarn run task build

test:
  yarn run task test

clean:
  sh scripts/for-each-package.sh sh ../../../../scripts/clean-others.sh

dev:
  yarn workspace @this-project/development-scripts-generate-build-json run start
  yarn workspace @this-project/development-scripts-list-packages-topo-order run start

task name:
  yarn run task {{name}}

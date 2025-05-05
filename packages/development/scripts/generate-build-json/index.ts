import { globSync } from "glob";
import { readFileSync, writeFileSync } from "node:fs";

const packages = globSync("../../../*/*/*/package.json", {
  absolute: true,
}).sort();
const nodes = packages.map((p) => {
  const json = JSON.parse(readFileSync(p).toString());
  const dependencies = Object.keys(json.dependencies ?? {})
    .concat(Object.keys(json.devDependencies ?? {}))
    .filter((d) => d.startsWith("@this-project/"))
    .map((d) => {
      const [, a] = d.match(/^@this-project\/(.*)$/)!;
      return a;
    });
  const [, a] = json.name.match(/^@this-project\/(.*)$/)!;
  const name = a;
  const [, b, c, d] = p
    .replace(/\\/g, "/")
    .match(/^.*\/([^\/]*)\/([^\/]*)\/([^\/]*)\/([^\/]*)$/)!;
  const path = `packages/${b}/${c}/${d}`;
  return {
    name,
    path,
    dependencies,
  };
});

const result = Object.fromEntries([
  [
    "build",
    {
      deps: nodes.map((n) => `build-${n.name}`),
      cmd: 'echo "done"',
    },
  ],
  ...nodes.map((n) => [
    `build-${n.name}`,
    {
      deps: n.dependencies.map((d) => `build-${d}`),
      cmd: `yarn workspace @this-project/${n.name} build`,
    },
  ]),
]);

writeFileSync("../../../../task/build.json", JSON.stringify(result, null, 2));

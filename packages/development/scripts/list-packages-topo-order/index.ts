import { topoOrder } from "@this-project/development-util-topo-order";
import { globSync, readFileSync, writeFileSync } from "fs";

const packages = globSync("../../../*/*/*/package.json").sort();
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

const ordered = topoOrder(nodes, (node) =>
  node.dependencies.map((d) => nodes.find((n) => n.name === d)!)
)!;

const output = ordered.map((n) => `${n.path}\n`);

writeFileSync("../../../../packages.txt", output.join(""));

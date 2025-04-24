import { topoOrder } from "@this-project/development-util-topo-order";
import { globSync, readFileSync, writeFileSync } from "fs";

const packages = globSync("../../../*/*/*/package.json").sort();
const nodes = packages.map((p) => {
  const json = JSON.parse(readFileSync(p).toString());
  const dependencies = Object.keys(json.dependencies ?? {})
    .concat(Object.keys(json.devDependencies ?? {}))
    .filter((d) => d.startsWith("@this-project/"))
    .map((d) => {
      const [, a, b, c] = d.match(/^@this-project\/(.*?)-(.*?)-(.*)$/)!;
      return [a, b, c].join("/");
    });
  const [, a, b, c] = json.name.match(/^@this-project\/(.*?)-(.*?)-(.*)$/)!;
  const name = [a, b, c].join("/");
  return {
    name,
    dependencies,
  };
});

const ordered = topoOrder(nodes, (node) =>
  node.dependencies.map((d) => nodes.find((n) => n.name === d)!)
)!;

const output = ordered.map((n) => `packages/${n.name}\n`);

writeFileSync("../../../../packages.txt", output.join(""));

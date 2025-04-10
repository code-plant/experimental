#!/usr/bin/env node

import { promises as fs } from "node:fs";

import { parse } from "@this-project/development-util-dotenv-parser";

(async () => {
  let value;
  try {
    const contents = (await fs.readFile(".env.example")).toString();
    value = parse(contents);
  } catch (e) {
    console.error(e);
    return;
  }
  const keys = Object.keys(value);
  const lines = keys.map((key) => `    "${key}": string;`);
  await fs.writeFile(
    "_dotenv.d.ts",
    `declare namespace NodeJS {
  interface ProcessEnv {
${lines.join("\n")}
  }
}
`
  );
})();

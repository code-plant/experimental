import { parse } from "../parse";
import { tokenize } from "../tokenize";
import { stringify } from "./stringify";

declare const console: { log: (...args: any[]) => void };

const tokens = tokenize(`

[a][b][/a][/b]

`);

if (!Array.isArray(tokens)) {
  throw new Error(tokens.message);
}

const document = parse(tokens);

console.log(stringify(document));

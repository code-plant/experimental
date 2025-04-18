import { Document } from "@this-project/common-mdcode-types";
import { parse as parseTokens } from "./parse";
import { tokenize } from "./tokenize";

export function parse(source: string): Document {
  const tokens = tokenize(source);
  if (!Array.isArray(tokens)) {
    throw new Error(tokens.message);
  }
  const result = parseTokens(tokens);
  if (!Array.isArray(result)) {
    throw new Error(result.message);
  }
  return result;
}

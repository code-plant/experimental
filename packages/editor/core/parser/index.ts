import { Document } from "@this-project/editor-core-types";
import { Result } from "@this-project/util-types-common";
import { parse as parseTokens } from "./parse";
import { tokenize } from "./tokenize";

export function parse(source: string): Result<Document> {
  const tokens = tokenize(source);
  if (!Array.isArray(tokens)) {
    return {
      type: "error",
      error: `${tokens.line}:${tokens.col}: ${tokens.message}`,
    };
  }
  const document = parseTokens(tokens);
  if (!Array.isArray(document)) {
    return {
      type: "error",
      error: `${document.tokenNear.line}:${document.tokenNear.col}: ${document.message}`,
    };
  }
  return {
    type: "ok",
    value: document,
  };
}

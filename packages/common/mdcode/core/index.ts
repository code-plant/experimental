import { parse } from "@this-project/common-mdcode-parser";
import { Document, Plugin } from "@this-project/common-mdcode-types";

export function compile(source: string, plugins: Plugin[]): Document {
  let document = parse(source);
  for (const { transform } of plugins) {
    document = transform?.(document) ?? document;
  }
  for (const { validate } of plugins) {
    const errors = validate?.(document);
    if (errors) {
      throw new Error(errors.map((e) => e.message).join("\n"));
    }
  }
  return document;
}

import { TypePlugin } from "@this-project/development-guc-core";
import { MarginTypePluginTheme } from "../..";
import { cssContent } from "../common/cssContent";
import { isValidClass } from "../common/isValidClass";

const PREFIX = "me-";

export const METypePlugin: TypePlugin<MarginTypePluginTheme> = {
  prefixes: [PREFIX],
  isValidClass: isValidClass(PREFIX),
  cssContent: cssContent(PREFIX, (value) => `margin-inline-end:${value};`),
};

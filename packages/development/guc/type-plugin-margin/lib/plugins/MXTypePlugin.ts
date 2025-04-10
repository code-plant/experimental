import { TypePlugin } from "@this-project/development-guc-core";
import { MarginTypePluginTheme } from "../..";
import { cssContent } from "../common/cssContent";
import { isValidClass } from "../common/isValidClass";

const PREFIX = "mx-";

export const MXTypePlugin: TypePlugin<MarginTypePluginTheme> = {
  prefixes: [PREFIX],
  isValidClass: isValidClass(PREFIX),
  cssContent: cssContent(
    PREFIX,
    (value) => `margin-left:${value};margin-right:${value};`
  ),
};

import { TypePlugin } from "@this-project/development-guc-core";
import { PaddingTypePluginTheme } from "../..";
import { cssContent } from "../common/cssContent";
import { isValidClass } from "../common/isValidClass";

const PREFIX = "pt-";

export const PTTypePlugin: TypePlugin<PaddingTypePluginTheme> = {
  prefixes: [PREFIX],
  isValidClass: isValidClass(PREFIX),
  cssContent: cssContent(PREFIX, (value) => `padding-top:${value};`),
};

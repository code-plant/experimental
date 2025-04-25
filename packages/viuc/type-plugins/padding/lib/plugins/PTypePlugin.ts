import { TypePlugin } from "@this-project/viuc-main-core";
import { PaddingTypePluginTheme } from "../..";
import { cssContent } from "../common/cssContent";
import { isValidClass } from "../common/isValidClass";

const PREFIX = "p-";

export const PTypePlugin: TypePlugin<PaddingTypePluginTheme> = {
  prefixes: [PREFIX],
  isValidClass: isValidClass(PREFIX),
  cssContent: cssContent(PREFIX, (value) => `padding:${value};`),
};

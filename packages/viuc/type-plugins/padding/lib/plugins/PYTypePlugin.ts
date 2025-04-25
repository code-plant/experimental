import { TypePlugin } from "@this-project/viuc-main-core";
import { PaddingTypePluginTheme } from "../..";
import { cssContent } from "../common/cssContent";
import { isValidClass } from "../common/isValidClass";

const PREFIX = "py-";

export const PYTypePlugin: TypePlugin<PaddingTypePluginTheme> = {
  prefixes: [PREFIX],
  isValidClass: isValidClass(PREFIX),
  cssContent: cssContent(
    PREFIX,
    (value) => `padding-top:${value};padding-bottom:${value};`
  ),
};

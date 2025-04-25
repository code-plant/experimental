import {
  CSSContent,
  ThemeBase,
  VariantPlugin,
} from "@this-project/viuc-main-core";

const NAME = "focus";

export const FocusVariantPlugin: VariantPlugin<ThemeBase> = {
  prefixes: [NAME],
  isValidVariant(variant): boolean {
    return variant === NAME;
  },
  process(content): CSSContent[] {
    return [{ ...content, selector: `${content.selector}:focus` }];
  },
};

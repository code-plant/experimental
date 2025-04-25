import {
  CSSContent,
  ThemeBase,
  VariantPlugin,
} from "@this-project/viuc-main-core";

const PREFIX = "group-focus";

export const GroupFocusVariantPlugin: VariantPlugin<ThemeBase> = {
  prefixes: [PREFIX],
  isValidVariant(variant): boolean {
    return variant === PREFIX || variant.startsWith(PREFIX + "-[");
  },
  process(content, variant): CSSContent[] {
    const value =
      variant === PREFIX ? "group" : variant.slice(PREFIX.length + 2, -1);
    return [{ ...content, selector: `.${value}:focus ${content.selector}` }];
  },
};

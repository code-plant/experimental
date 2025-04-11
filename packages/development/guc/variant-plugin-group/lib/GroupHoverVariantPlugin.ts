import {
  CSSContent,
  ThemeBase,
  VariantPlugin,
} from "@this-project/development-guc-core";

const PREFIX = "group-hover";

export const GroupHoverVariantPlugin: VariantPlugin<ThemeBase> = {
  prefixes: [PREFIX],
  isValidVariant(variant): boolean {
    return variant === PREFIX || variant.startsWith(PREFIX + "-[");
  },
  process(content, variant): CSSContent[] {
    const value =
      variant === PREFIX ? "group" : variant.slice(PREFIX.length + 2, -1);
    return [{ ...content, selector: `.${value}:hover ${content.selector}` }];
  },
};

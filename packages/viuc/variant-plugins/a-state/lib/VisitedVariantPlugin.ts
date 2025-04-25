import {
  CSSContent,
  ThemeBase,
  VariantPlugin,
} from "@this-project/viuc-main-core";

const NAME = "visited";

export const VisitedVariantPlugin: VariantPlugin<ThemeBase> = {
  prefixes: [NAME],
  isValidVariant(variant): boolean {
    return variant === NAME;
  },
  process(content): CSSContent[] {
    return [{ ...content, selector: `${content.selector}:visited` }];
  },
};

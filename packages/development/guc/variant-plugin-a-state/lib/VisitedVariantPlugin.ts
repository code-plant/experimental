import {
  CSSContent,
  ThemeBase,
  VariantPlugin,
} from "@this-project/development-guc-core";

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

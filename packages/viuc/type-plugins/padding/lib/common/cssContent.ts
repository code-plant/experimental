import { CSSContent, TypePlugin } from "@this-project/viuc-main-core";
import { PaddingTypePluginTheme } from "../..";

export function cssContent(
  prefix: string,
  content: (value: string) => string,
): TypePlugin<PaddingTypePluginTheme>["cssContent"] {
  return function (className, escapedFullClassName, config): CSSContent[] {
    const actualPrefix = config.prefix + prefix;
    const value = className.startsWith(actualPrefix + "[")
      ? className.slice(actualPrefix.length + 1, -1)
      : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        config.theme.padding[className.slice(actualPrefix.length)]!;
    return [
      {
        selector: `.${escapedFullClassName}`,
        content: content(
          typeof value === "number" ? `${String(value)}px` : value,
        ),
        couldAffectedByVariants: true,
      },
    ];
  };
}

import { ThemeBase, TypePlugin } from "@this-project/viuc-main-core";

const PREFIX = "color-";

function dup(value: string): [light: string, dark: string] {
  return [value, value];
}

export const ColorTypePlugin: TypePlugin<ThemeBase> = {
  prefixes: [PREFIX],
  isValidClass: (className, config) => {
    const actualPrefix = config.prefix + PREFIX;
    return (
      className.startsWith(actualPrefix) &&
      (className.startsWith(actualPrefix + "[") ||
        className.slice(actualPrefix.length) in config.theme.color)
    );
  },
  cssContent: (className, escapedFullClassName, config) => {
    const actualPrefix = config.prefix + PREFIX;
    const [light, dark] = className.startsWith(actualPrefix + "[")
      ? dup(className.slice(actualPrefix.length + 1, -1))
      : config.theme.color[className.slice(actualPrefix.length)]!;
    return config.darkModeStrategy.type === "class"
      ? [
          {
            selector: `.${escapedFullClassName}`,
            content: `color:${light};`,
            couldAffectedByVariants: true,
          },
          {
            selector: `${
              config.darkModeStrategy.on === "any"
                ? ""
                : config.darkModeStrategy.on
            }.${config.darkModeStrategy.className} .${escapedFullClassName}`,
            content: `color:${dark};`,
            couldAffectedByVariants: true,
          },
        ]
      : [
          {
            selector: `.${escapedFullClassName}`,
            content: `color:${light};`,
            couldAffectedByVariants: true,
          },
          {
            selector: `.${escapedFullClassName}`,
            content: `color:${dark};`,
            couldAffectedByVariants: true,
            media: { type: "terminal", media: "prefers-color-scheme:dark" },
          },
        ];
  },
};

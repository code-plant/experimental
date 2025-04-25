import { TypePlugin } from "@this-project/viuc-main-core";
import { MarginTypePluginTheme } from "../..";

export function isValidClass(
  prefix: string
): TypePlugin<MarginTypePluginTheme>["isValidClass"] {
  return function (className, config): boolean {
    const actualPrefix = config.prefix + prefix;
    return (
      className.startsWith(actualPrefix) &&
      (className.startsWith(actualPrefix + "[") ||
        className.slice(actualPrefix.length) in config.theme.margin)
    );
  };
}

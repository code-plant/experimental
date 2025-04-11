import { TypePlugin } from "@this-project/development-guc-core";
import { PaddingTypePluginTheme } from "../..";

export function isValidClass(
  prefix: string
): TypePlugin<PaddingTypePluginTheme>["isValidClass"] {
  return function (className, config): boolean {
    const actualPrefix = config.prefix + prefix;
    return (
      className.startsWith(actualPrefix) &&
      (className.startsWith(actualPrefix + "[") ||
        className.slice(actualPrefix.length) in config.theme.padding)
    );
  };
}

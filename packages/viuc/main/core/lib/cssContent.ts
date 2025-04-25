import cssesc = require("cssesc");
import { executionContext, ExecutionContext } from "./executionContext";
import { Config, ConfigWithoutPlugins } from "./types/Config";
import { CSSContent } from "./types/CSSContent";
import { GUCClass } from "./types/GUCClass";
import { ThemeBase } from "./types/ThemeBase";
import { TypePlugin } from "./types/TypePlugin";
import { VariantPlugin } from "./types/VariantPlugin";
import { GUCClassToString } from "./util/GUCClassToString";

function classNameHandler<TTheme extends ThemeBase>(
  className: string,
  config: ConfigWithoutPlugins<TTheme>,
  context: ExecutionContext<TTheme>
): TypePlugin<TTheme> {
  let valid = false;
  for (const prefix in context.typePrefixes) {
    if (className.slice(0, prefix.length) == prefix) {
      for (const plugin of context.typePrefixes[prefix]!) {
        if (plugin.isValidClass(className, config)) {
          return plugin;
        }
      }
    }
  }
  for (const plugin of context.typesWithoutPrefix) {
    if (plugin.isValidClass(className, config)) {
      return plugin;
    }
  }
  throw new Error("maybe unreachable");
}

function variantHandler<TTheme extends ThemeBase>(
  variant: string,
  config: ConfigWithoutPlugins<TTheme>,
  context: ExecutionContext<TTheme>
): VariantPlugin<TTheme> {
  let valid = false;
  for (const prefix in context.variantPrefixes) {
    if (variant.slice(0, prefix.length) == prefix) {
      for (const plugin of context.variantPrefixes[prefix]!) {
        if (plugin.isValidVariant(variant, config)) {
          return plugin;
        }
      }
    }
  }
  for (const plugin of context.variantsWithoutPrefix) {
    if (plugin.isValidVariant(variant, config)) {
      return plugin;
    }
  }
  throw new Error("maybe unreachable");
}

export function cssContent<TTheme extends ThemeBase>(
  gucClass: GUCClass,
  config: Config<TTheme>,
  context: ExecutionContext<TTheme> = executionContext(config)
): CSSContent[] {
  const { typePlugins, variantPlugins, ...configWithoutPlugins } = config;
  const { className, variants } = gucClass;
  return variants.reduce<CSSContent[]>((contents, variant) => {
    const plugin = variantHandler(variant, configWithoutPlugins, context);
    const result: CSSContent[] = [];
    for (const content of contents) {
      if (content.couldAffectedByVariants) {
        result.push(...plugin.process(content, variant, configWithoutPlugins));
      } else {
        result.push(content);
      }
    }
    return result;
  }, classNameHandler(className, configWithoutPlugins, context).cssContent(className, cssesc(GUCClassToString(gucClass), { isIdentifier: true }), configWithoutPlugins) || []);
}

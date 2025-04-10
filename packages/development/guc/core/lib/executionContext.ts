import { Config } from "./types/Config";
import { TypePlugin } from "./types/TypePlugin";
import { VariantPlugin } from "./types/VariantPlugin";

export interface ExecutionContext<TTheme> {
  typePrefixes: TypePrefixes<TTheme>;
  typesWithoutPrefix: TypePlugin<TTheme>[];
  variantPrefixes: VariantPrefixes<TTheme>;
  variantsWithoutPrefix: VariantPlugin<TTheme>[];
  warnings: Record<string, number>;
}

export interface TypePrefixes<TTheme> {
  [_: string]: TypePlugin<TTheme>[] | undefined;
}

export interface VariantPrefixes<TTheme> {
  [_: string]: VariantPlugin<TTheme>[];
}

export function executionContext<TTheme>(
  config: Config<TTheme>
): ExecutionContext<TTheme> {
  const typePrefixes: TypePrefixes<TTheme> = {};
  const typesWithoutPrefix: TypePlugin<TTheme>[] = [];
  const variantPrefixes: VariantPrefixes<TTheme> = {};
  const variantsWithoutPrefix: VariantPlugin<TTheme>[] = [];

  for (const plugin of config.typePlugins) {
    if (plugin.prefixes) {
      for (const prefix of plugin.prefixes) {
        (typePrefixes[prefix] ??= []).push(plugin);
      }
    } else {
      typesWithoutPrefix.push(plugin);
    }
  }

  for (const plugin of config.variantPlugins) {
    if (plugin.prefixes) {
      for (const prefix of plugin.prefixes) {
        (variantPrefixes[prefix] ??= []).push(plugin);
      }
    } else {
      variantsWithoutPrefix.push(plugin);
    }
  }

  return {
    typePrefixes,
    typesWithoutPrefix,
    variantPrefixes,
    variantsWithoutPrefix,
    warnings: {},
  };
}

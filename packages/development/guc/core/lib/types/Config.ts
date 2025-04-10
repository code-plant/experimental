import { TypePlugin } from "./TypePlugin";
import { VariantPlugin } from "./VariantPlugin";

export interface Config<TTheme> extends ConfigWithoutPlugins<TTheme> {
  typePlugins: readonly TypePlugin<TTheme>[];
  variantPlugins: readonly VariantPlugin<TTheme>[];
}

export interface ConfigWithoutPlugins<TTheme> {
  prefix: string;
  theme: TTheme;
  allowArbitraryValue: boolean;
  darkModeStrategy: DarkModeStrategy;
}

export type DarkModeStrategy = DarkModeStrategyClass | DarkModeStrategyMedia;

export interface DarkModeStrategyClass {
  type: "class";
  on: "html" | "body" | "any";
  fallbackDarkMode: boolean;
}

export interface DarkModeStrategyMedia {
  type: "media";
  fallbackDarkMode: boolean;
}

import { ThemeBase } from "./ThemeBase";
import { TypePlugin } from "./TypePlugin";
import { VariantPlugin } from "./VariantPlugin";

export interface Config<TTheme extends ThemeBase>
  extends ConfigWithoutPlugins<TTheme> {
  typePlugins: readonly TypePlugin<TTheme>[];
  variantPlugins: readonly VariantPlugin<TTheme>[];
}

export interface ConfigWithoutPlugins<TTheme extends ThemeBase> {
  prefix: string;
  theme: TTheme;
  darkModeStrategy: DarkModeStrategy;
}

export type DarkModeStrategy = DarkModeStrategyClass | DarkModeStrategyMedia;

export interface DarkModeStrategyClass {
  type: "class";
  className: string;
  on: "html" | "body" | "any";
}

export interface DarkModeStrategyMedia {
  type: "media";
}

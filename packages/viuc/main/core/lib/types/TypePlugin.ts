import { ConfigWithoutPlugins } from "./Config";
import { CSSContent } from "./CSSContent";
import { ThemeBase } from "./ThemeBase";

export interface TypePlugin<TTheme extends ThemeBase> {
  prefixes: string[] | undefined;
  isValidClass: (
    className: string,
    config: ConfigWithoutPlugins<TTheme>
  ) => boolean;
  cssContent: (
    className: string,
    escapedFullClassName: string,
    config: ConfigWithoutPlugins<TTheme>
  ) => CSSContent[] | undefined;
}

import { ConfigWithoutPlugins } from "./Config";
import { CSSContent } from "./CSSContent";

export interface TypePlugin<TTheme> {
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

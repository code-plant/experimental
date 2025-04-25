import { ConfigWithoutPlugins } from "./Config";
import { CSSContent } from "./CSSContent";
import { ThemeBase } from "./ThemeBase";

export interface VariantPlugin<TTheme extends ThemeBase> {
  prefixes: string[] | undefined;
  isValidVariant: (
    variant: string,
    config: ConfigWithoutPlugins<TTheme>
  ) => boolean;
  process(
    content: CSSContent,
    variant: string,
    config: ConfigWithoutPlugins<TTheme>
  ): CSSContent[];
}

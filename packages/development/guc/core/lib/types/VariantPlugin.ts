import { ConfigWithoutPlugins } from "./Config";
import { CSSContent } from "./CSSContent";

export interface VariantPlugin<TTheme> {
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

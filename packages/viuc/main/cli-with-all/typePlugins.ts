import { ThemeBase, TypePlugin } from "@this-project/viuc-main-core";
import { ColorTypePlugin } from "@this-project/viuc-type-plugins-color";
import {
  MarginTypePlugins,
  MarginTypePluginTheme,
} from "@this-project/viuc-type-plugins-margin";
import {
  PaddingTypePlugins,
  PaddingTypePluginTheme,
} from "@this-project/viuc-type-plugins-padding";

export interface TypePluginsTheme
  extends ThemeBase,
    MarginTypePluginTheme,
    PaddingTypePluginTheme {}

export const typePlugins: readonly TypePlugin<TypePluginsTheme>[] = [
  ...MarginTypePlugins,
  ...PaddingTypePlugins,
  ColorTypePlugin,
];

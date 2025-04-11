import { TypePlugin } from "@this-project/development-guc-core";
import { ColorTypePlugin } from "@this-project/development-guc-type-plugin-color";
import {
  MarginTypePlugins,
  MarginTypePluginTheme,
} from "@this-project/development-guc-type-plugin-margin";
import {
  PaddingTypePlugins,
  PaddingTypePluginTheme,
} from "@this-project/development-guc-type-plugin-padding";

export interface TypePluginsTheme
  extends MarginTypePluginTheme,
    PaddingTypePluginTheme {}

export const typePlugins: readonly TypePlugin<TypePluginsTheme>[] = [
  ...MarginTypePlugins,
  ...PaddingTypePlugins,
  ColorTypePlugin,
];

import { TypePlugin } from "@this-project/development-guc-core";
import {
  MarginTypePlugins,
  MarginTypePluginTheme,
} from "@this-project/development-guc-type-plugin-margin";

export interface TypePluginsTheme extends MarginTypePluginTheme {}

export const typePlugins: readonly TypePlugin<TypePluginsTheme>[] = [
  ...MarginTypePlugins,
];

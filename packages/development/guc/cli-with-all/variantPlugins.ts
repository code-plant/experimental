import { ThemeBase, VariantPlugin } from "@this-project/development-guc-core";
import { AStateVariantPlugins } from "@this-project/development-guc-variant-plugin-a-state";
import { GroupVariantPlugins } from "@this-project/development-guc-variant-plugin-group";
import {
  MediaVariantPlugin,
  MediaVariantPluginTheme,
} from "@this-project/development-guc-variant-plugin-media";

export interface VariantPluginsTheme
  extends ThemeBase,
    MediaVariantPluginTheme {}

export const variantPlugins: readonly VariantPlugin<VariantPluginsTheme>[] = [
  MediaVariantPlugin,
  ...GroupVariantPlugins,
  ...AStateVariantPlugins,
];

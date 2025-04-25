import { ThemeBase, VariantPlugin } from "@this-project/viuc-main-core";
import { AStateVariantPlugins } from "@this-project/viuc-variant-plugins-a-state";
import { GroupVariantPlugins } from "@this-project/viuc-variant-plugins-group";
import {
  MediaVariantPlugin,
  MediaVariantPluginTheme,
} from "@this-project/viuc-variant-plugins-media";

export interface VariantPluginsTheme
  extends ThemeBase,
    MediaVariantPluginTheme {}

export const variantPlugins: readonly VariantPlugin<VariantPluginsTheme>[] = [
  MediaVariantPlugin,
  ...GroupVariantPlugins,
  ...AStateVariantPlugins,
];

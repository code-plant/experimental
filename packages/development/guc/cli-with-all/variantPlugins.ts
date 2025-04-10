import { VariantPlugin } from "@this-project/development-guc-core";
import {
  MediaVariantPlugin,
  MediaVariantPluginTheme,
} from "@this-project/development-guc-variant-plugin-media";

export interface VariantPluginsTheme extends MediaVariantPluginTheme {}

export const variantPlugins: readonly VariantPlugin<VariantPluginsTheme>[] = [
  MediaVariantPlugin,
];

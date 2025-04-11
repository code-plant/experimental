import { ThemeBase, TypePlugin } from "@this-project/development-guc-core";
import { PBTypePlugin } from "./lib/plugins/PBTypePlugin";
import { PETypePlugin } from "./lib/plugins/PETypePlugin";
import { PLTypePlugin } from "./lib/plugins/PLTypePlugin";
import { PRTypePlugin } from "./lib/plugins/PRTypePlugin";
import { PSTypePlugin } from "./lib/plugins/PSTypePlugin";
import { PTTypePlugin } from "./lib/plugins/PTTypePlugin";
import { PTypePlugin } from "./lib/plugins/PTypePlugin";
import { PXTypePlugin } from "./lib/plugins/PXTypePlugin";
import { PYTypePlugin } from "./lib/plugins/PYTypePlugin";

export interface PaddingTypePluginTheme extends ThemeBase {
  padding: Record<string, string | number>;
}

export const PaddingTypePlugins: TypePlugin<PaddingTypePluginTheme>[] = [
  PTypePlugin,
  PXTypePlugin,
  PYTypePlugin,
  PLTypePlugin,
  PRTypePlugin,
  PTTypePlugin,
  PBTypePlugin,
  PSTypePlugin,
  PETypePlugin,
];

export {
  PBTypePlugin,
  PETypePlugin,
  PLTypePlugin,
  PRTypePlugin,
  PSTypePlugin,
  PTTypePlugin,
  PTypePlugin,
  PXTypePlugin,
  PYTypePlugin,
};

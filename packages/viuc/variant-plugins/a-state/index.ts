import { ThemeBase, VariantPlugin } from "@this-project/viuc-main-core";
import { ActiveVariantPlugin } from "./lib/ActiveVariantPlugin";
import { FocusVariantPlugin } from "./lib/FocusVariantPlugin";
import { HoverVariantPlugin } from "./lib/HoverVariantPlugin";
import { VisitedVariantPlugin } from "./lib/VisitedVariantPlugin";

export const AStateVariantPlugins: VariantPlugin<ThemeBase>[] = [
  HoverVariantPlugin,
  FocusVariantPlugin,
  ActiveVariantPlugin,
  VisitedVariantPlugin,
];

export {
  ActiveVariantPlugin,
  FocusVariantPlugin,
  HoverVariantPlugin,
  VisitedVariantPlugin,
};

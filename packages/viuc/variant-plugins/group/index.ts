import { ThemeBase, VariantPlugin } from "@this-project/viuc-main-core";
import { GroupFocusVariantPlugin } from "./lib/GroupFocusVariantPlugin";
import { GroupHoverVariantPlugin } from "./lib/GroupHoverVariantPlugin";

export const GroupVariantPlugins: VariantPlugin<ThemeBase>[] = [
  GroupHoverVariantPlugin,
  GroupFocusVariantPlugin,
];

export { GroupFocusVariantPlugin, GroupHoverVariantPlugin };

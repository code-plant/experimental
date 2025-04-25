import { NodeBase } from "@this-project/editor-core-types";
import { Result } from "@this-project/util-common-types";
import { ReactNode } from "react";

export interface RenderOptions<C> {
  context?: C;
}

export type ReactPlugin<T extends NodeBase, A extends NodeBase, C> = {
  renderNode: (
    node: T,
    options: RenderOptions<C>,
    renderOtherNode: (node: A) => Result<ReactNode>
  ) => Result<ReactNode>;
};

import { NodeBase } from "@this-project/editor-core-types";
import { ComponentType, ReactElement } from "react";

export interface RenderOptions<T> {
  components?: Partial<
    Record<string, ComponentType<Partial<Record<string, string | true>>>>
  >;
  context?: T;
}

export type ReactPlugin<T extends NodeBase, O> = {
  renderNode: (
    node: T,
    options: RenderOptions<O>,
    renderOtherNode: (node: T) => ReactElement | null
  ) => ReactElement | null;
};

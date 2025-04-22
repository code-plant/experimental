import { NodeBase } from "@this-project/editor-core-types";
import { ComponentType, ReactElement } from "react";

export interface RenderOptions<T extends NodeBase, C> {
  renderTag?: Partial<Record<string, RenderTag<T, C>>>;
  context?: C;
}

export type RenderTag<T extends NodeBase, C> =
  | RenderTagComponent<T, C>
  | RenderTagFunction<T, C>;

export interface RenderTagComponentProps<T extends NodeBase, C> {
  node: T;
  context: C | undefined;
  defaultAttribute?: string;
  attributes: Partial<Record<string, string | true>>;
}

export interface RenderTagComponent<T extends NodeBase, C> {
  type: "component";
  component: ComponentType<RenderTagComponentProps<T, C>>;
}

export interface RenderTagFunction<T extends NodeBase, C> {
  type: "function";
  function: (
    node: T,
    context: C | undefined,
    defaultAttribute: string | undefined,
    attributes: Partial<Record<string, string | true>>
  ) => ReactElement | null;
}

export type ReactPlugin<T extends NodeBase, C> = {
  renderNode: (
    node: T,
    options: RenderOptions<T, C>,
    renderOtherNode: (node: T) => ReactElement | null
  ) => ReactElement | null;
};

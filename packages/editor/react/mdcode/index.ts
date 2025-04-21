import { UnionToIntersection } from "@this-project/common-util-types";
import { Document, NodeBase } from "@this-project/editor-core-types";
import { ReactPlugin, RenderOptions } from "@this-project/editor-react-mdcode";
import { createElement, Fragment, ReactElement, ReactNode } from "react";

export interface SectionComponentProps<T> {
  context?: T;
  level: number;
  title: string;
  id?: string;
  children: ReactNode[];
}

export function render<T extends NodeBase, O>(
  document: Document<T>,
  plugins: UnionToIntersection<
    T extends infer I extends NodeBase
      ? Record<I["type"], ReactPlugin<I, O>>
      : never
  >,
  options: RenderOptions<O> = {}
): ReactElement | null {
  const children: ReactNode[] = [];
  for (const node of document) {
    const child = renderNode(node, plugins, options);
    if (!child) {
      return null;
    }
    children.push(child);
  }
  return createElement(Fragment, null, ...children);
}

function renderNode<T extends NodeBase, O>(
  node: T,
  plugins: UnionToIntersection<
    T extends infer I extends NodeBase
      ? Record<I["type"], ReactPlugin<I, O>>
      : never
  >,
  options: RenderOptions<O>
): ReactElement | null {
  const plugin = (plugins as Record<string, ReactPlugin<NodeBase, O>>)[
    node.type
  ];
  if (plugin) {
    return plugin.renderNode(node, options, (node) =>
      renderNode<T, O>(node as T, plugins, options)
    );
  } else {
    throw new Error(`No plugin found for node type: ${node.type}`);
  }
}

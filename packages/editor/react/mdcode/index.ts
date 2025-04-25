import { Document, NodeBase } from "@this-project/editor-core-types";
import { ReactPlugin, RenderOptions } from "@this-project/editor-react-types";
import { unwrap, UnwrapError } from "@this-project/util-atomic-unwrap";
import { Result, UnionToIntersection } from "@this-project/util-common-types";
import { createElement, Fragment, ReactNode } from "react";

export interface SectionComponentProps<T> {
  context?: T;
  level: number;
  title: string;
  id?: string;
  children: ReactNode[];
}

export function render<T extends NodeBase, C, TBackup extends T = T>(
  document: Document<T>,
  plugins: UnionToIntersection<
    T extends infer I extends NodeBase
      ? Record<I["type"], ReactPlugin<I, TBackup, C>>
      : never
  >,
  options: RenderOptions<C> = {}
): Result<ReactNode> {
  try {
    const children: ReactNode[] = [];
    for (const node of document) {
      children.push(unwrap(renderNode(node, plugins, options)));
    }
    return { type: "ok", value: createElement(Fragment, null, ...children) };
  } catch (error) {
    if (error instanceof UnwrapError) {
      return { type: "error", error: error.error };
    } else {
      throw error;
    }
  }
}

function renderNode<T extends NodeBase, C, TBackup extends T = T>(
  node: T,
  plugins: UnionToIntersection<
    T extends infer I extends NodeBase
      ? Record<I["type"], ReactPlugin<I, TBackup, C>>
      : never
  >,
  options: RenderOptions<C>
): Result<ReactNode> {
  const plugin = (plugins as Record<string, ReactPlugin<T, T, C>>)[node.type];
  if (plugin) {
    return plugin.renderNode(node, options, (node) =>
      renderNode<T, C>(node as T, plugins, options)
    );
  } else {
    return {
      type: "error",
      error: `No plugin found for node type: ${node.type}`,
    };
  }
}

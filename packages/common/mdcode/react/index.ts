import { Document, InlineNode, Node } from "@this-project/common-mdcode-types";
import {
  ComponentType,
  createElement,
  Fragment,
  ReactElement,
  ReactNode,
} from "react";
import { DefaultSection } from "./DefaultSection";

export interface SectionComponentProps<T> {
  context?: T;
  level: number;
  title: string;
  id?: string;
  children: ReactNode[];
}

export interface RenderOptions<T> {
  components?: Partial<
    Record<string, ComponentType<Partial<Record<string, string | true>>>>
  >;
  sectionComponent?: ComponentType<SectionComponentProps<T>>;
  context?: T;
}

export function render<T>(
  document: Document,
  options: RenderOptions<T> = {},
  headingLevelStart = 1
): ReactElement | null {
  const children: ReactNode[] = [];
  for (const node of document) {
    const child = renderNode(node, options, headingLevelStart);
    if (!child) {
      return null;
    }
    children.push(child);
  }
  return createElement(Fragment, null, ...children);
}

function renderNode<T>(
  node: Node,
  options: RenderOptions<T>,
  headingLevel: number
): ReactElement | null {
  if (node.type === "section") {
    const children = render(node.children, options, headingLevel + 1);
    if (!children) {
      return null;
    }
    return createElement(options.sectionComponent ?? DefaultSection, {
      title: node.title,
      id: node.id,
      level: headingLevel,
      children: [children],
    });
  }
  return renderInlineNode(node, options);
}

function renderInlineNode<T>(
  node: InlineNode,
  options: RenderOptions<T>
): ReactElement | null {
  if (node.type === "text") {
    return createElement("span", null, node.content);
  }
  if (node.type === "codeBlock") {
    //
  }
  return null;
}

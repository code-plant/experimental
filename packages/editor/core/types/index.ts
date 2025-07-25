import { Result } from "@this-project/util-types-common";

export type Document<T extends NodeBase = DefaultNode> = T[];

export type DefaultNode = NodeText | NodeTag<DefaultNode> | NodeCodeBlock;

export interface NodeBase {
  type: string;
  line: number;
  col: number;
  context?: Context;
}

export interface NodeText extends NodeBase {
  type: "text";
  content: string;
}

export interface NodeTag<T extends NodeBase> extends NodeBase {
  type: "tag";
  name: string;
  defaultAttr?: string;
  attrs: Partial<Record<string, string | true>>;
  children: T[];
}

export interface NodeCodeBlock extends NodeBase {
  type: "code";
  indent: string;
  lang: string;
  content: string;
}

export interface Context
  extends Partial<Record<string | number | symbol, unknown>> {
  isMeaningful?: boolean;
}

export type Plugin<T extends NodeBase, U extends NodeBase> = (
  document: Document<T>,
) => Result<Document<U>, ValidationError<T>>;

export interface ValidationError<T extends NodeBase> {
  message: string;
  node: T;
}

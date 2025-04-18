export type Document = Node[];

export type Node = NodeSection | NodeText | NodeTag | NodeCodeBlock;
export type InlineNode = Exclude<Node, NodeSection>;

export interface NodeBase {
  type: string;
  line: number;
  col: number;
  context?: Context;
}

export interface NodeSection extends NodeBase {
  type: "section";
  title: string;
  id?: string;
  children: Node[];
}

export interface NodeText extends NodeBase {
  type: "text";
  content: string;
}

export interface NodeTag extends NodeBase {
  type: "tag";
  name: string;
  defaultAttr?: string;
  attrs: Partial<Record<string, string | true>>;
  children: InlineNode[];
}

export interface NodeCodeBlock extends NodeBase {
  type: "codeBlock";
  lang: string;
  content: string;
}

export interface Context extends Partial<Record<keyof any, unknown>> {
  isMeaningful?: boolean;
}

export type Transformer = (document: Document) => Document;

export type Validator = (document: Document) => ValidationError[] | undefined;

export interface ValidationError {
  message: string;
  node: Node;
}

export interface Plugin {
  transform?: Transformer;
  validate?: Validator;
}

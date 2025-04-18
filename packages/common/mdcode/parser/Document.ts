export type Document = Node[];

export type Node = NodeSection | NodeText | NodeTag | NodeCodeBlock;
export type InlineNode = Exclude<Node, NodeSection>;

export interface NodeBase {
  type: string;
  line: number;
  col: number;
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

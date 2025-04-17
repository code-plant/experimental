export type Token =
  | TokenSectionStart
  | TokenSectionEnd
  | TokenText
  | TokenTagStart
  | TokenTagEnd
  | TokenBlock;

export interface TokenBase {
  type: string;
  line: number;
  col: number;
}

export interface TokenSectionStart extends TokenBase {
  type: "sectionStart";
  title: string;
  id?: string;
  content: Token[];
  depth: number;
}

export interface TokenSectionEnd extends TokenBase {
  type: "sectionEnd";
  depth: number;
}

export interface TokenText extends TokenBase {
  type: "text";
  value: string;
}

export interface TokenTagStart extends TokenBase {
  type: "tagStart";
  name: string;
  defaultAttr?: string;
  attrs: Partial<Record<string, string | true>>;
  selfClose: boolean;
}

export interface TokenTagEnd extends TokenBase {
  type: "tagEnd";
  name: string;
}

export interface TokenBlock extends TokenBase {
  type: "block";
  lang: string;
  content: string;
}

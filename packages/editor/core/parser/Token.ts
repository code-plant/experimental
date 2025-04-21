export type Token = TokenText | TokenTagStart | TokenTagEnd | TokenCodeBlock;

export interface TokenBase {
  type: string;
  line: number;
  col: number;
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

export interface TokenCodeBlock extends TokenBase {
  type: "codeBlock";
  lang: string;
  content: string;
}

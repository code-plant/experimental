import {
  DefaultNode,
  Document,
  NodeTag,
} from "@this-project/editor-core-types";
import { Token } from "./Token";

export interface ParseError {
  tokenNear: Token;
  message: string;
}

export function parse(tokens: Token[]): Document | ParseError {
  const result: DefaultNode[] = [];
  const tagStack: NodeTag<DefaultNode>[] = [];

  for (const token of tokens) {
    if (token.type === "tagStart") {
      const node: NodeTag<DefaultNode> = {
        type: "tag",
        line: token.line,
        col: token.col,
        name: token.name,
        attrs: token.attrs,
        children: [],
      };
      (tagStack[tagStack.length - 1]?.children ?? result).push(node);
      if (!token.selfClose) {
        tagStack.push(node);
      }
    } else if (token.type === "tagEnd") {
      if (tagStack[tagStack.length - 1]?.name !== token.name) {
        return {
          tokenNear: token,
          message: "Unmatched tag",
        };
      }
      tagStack.pop();
    } else if (token.type === "text") {
      (tagStack[tagStack.length - 1]?.children ?? result).push({
        type: "text",
        line: token.line,
        col: token.col,
        content: token.value,
      });
    } else if (token.type === "codeBlock") {
      (tagStack[tagStack.length - 1]?.children ?? result).push({
        type: "code",
        line: token.line,
        col: token.col,
        indent: token.indent,
        lang: token.lang,
        content: token.content,
      });
    }
  }

  if (tagStack.length > 0) {
    return {
      tokenNear: tokens[tokens.length - 1],
      message: "Unclosed tag",
    };
  }

  return result;
}

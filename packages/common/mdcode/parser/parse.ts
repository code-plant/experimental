import { Document, InlineNode } from "./Document";
import { Token, TokenTagEnd, TokenTagStart } from "./Token";

export interface ParseError {
  tokenNear: Token;
  message: string;
}

// Intermediate types for two-phase parsing
interface IntermediateNodeBase {
  type: string;
  line: number;
  col: number;
}

interface IntermediateSection extends IntermediateNodeBase {
  type: "section";
  title: string;
  id?: string;
  children: IntermediateDocument;
  depth: number;
}

interface IntermediateText extends IntermediateNodeBase {
  type: "text";
  content: string;
}

interface IntermediateTag extends IntermediateNodeBase {
  type: "tag";
  name: string;
  defaultAttr?: string;
  attrs: Partial<Record<string, string | true>>;
  children: InlineNode[];
  selfClose: boolean;
  openingToken: TokenTagStart;
}

interface IntermediateTagEnd extends IntermediateNodeBase {
  type: "tagEnd";
  name: string;
  closingToken: TokenTagEnd;
}

interface IntermediateCodeBlock extends IntermediateNodeBase {
  type: "codeBlock";
  lang: string;
  content: string;
}

type IntermediateNode =
  | IntermediateSection
  | IntermediateText
  | IntermediateTag
  | IntermediateTagEnd
  | IntermediateCodeBlock;

type IntermediateInlineNode = Exclude<IntermediateNode, IntermediateSection>;

type IntermediateDocument = (IntermediateSection | IntermediateInlineNode[])[];

// First pass: Build section hierarchy
function buildSectionHierarchy(
  tokens: Token[]
): IntermediateDocument | ParseError {
  const result: IntermediateDocument = [];
  const stack: IntermediateSection[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === "sectionStart") {
      // Validate section depth
      if (token.depth > stack.length + 1) {
        return {
          tokenNear: token,
          message: `Section depth cannot increase by more than 1. Expected depth ${
            stack.length + 1
          }, got ${token.depth}`,
        };
      }

      // Create new section
      const sectionNode: IntermediateSection = {
        type: "section",
        title: token.title,
        id: token.id,
        children: [],
        line: token.line,
        col: token.col,
        depth: token.depth,
      };

      // Handle section nesting based on depth
      if (token.depth > stack.length) {
        // Going deeper - add as child of current section
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(sectionNode);
        } else {
          result.push(sectionNode);
        }
        stack.push(sectionNode);
      } else if (token.depth === stack.length) {
        // Same level - add as sibling of current section
        if (stack.length > 1) {
          stack[stack.length - 2].children.push(sectionNode);
        } else {
          result.push(sectionNode);
        }
        // Replace current section in stack
        if (stack.length > 0) {
          stack.pop();
        }
        stack.push(sectionNode);
      } else {
        // Going back up - close sections until we find the right level
        while (
          stack.length > 0 &&
          stack[stack.length - 1].depth >= token.depth
        ) {
          stack.pop();
        }
        // Add to parent or root
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(sectionNode);
        } else {
          result.push(sectionNode);
        }
        stack.push(sectionNode);
      }
    } else if (token.type === "sectionEnd") {
      // Close sections until we find the right level
      while (stack.length > 0 && stack[stack.length - 1].depth >= token.depth) {
        stack.pop();
      }
    } else {
      // For non-section tokens, create temporary nodes to be processed in second pass
      const tempNode = createTempNode(token);

      // Only add to section if we're actually in a section
      const pushTo =
        stack.length > 0 ? stack[stack.length - 1].children : result;

      if (pushTo.length > 0) {
        const last = pushTo[pushTo.length - 1];
        if (Array.isArray(last)) {
          last.push(tempNode);
        } else {
          pushTo.push([tempNode]);
        }
      } else {
        pushTo.push([tempNode]);
      }
    }
  }

  return result;
}

// Helper function to create temporary nodes for first pass
function createTempNode(token: Token): IntermediateInlineNode {
  switch (token.type) {
    case "text":
      return {
        type: "text",
        content: token.value,
        line: token.line,
        col: token.col,
      };
    case "block":
      return {
        type: "codeBlock",
        lang: token.lang,
        content: token.content,
        line: token.line,
        col: token.col,
      };
    case "tagStart":
      return {
        type: "tag",
        name: token.name,
        defaultAttr: token.defaultAttr,
        attrs: token.attrs,
        children: [],
        line: token.line,
        col: token.col,
        selfClose: token.selfClose,
        openingToken: token,
      };
    case "tagEnd":
      return {
        type: "tagEnd",
        name: token.name,
        line: token.line,
        col: token.col,
        closingToken: token,
      };
    default:
      throw new Error(`Unexpected token type: ${token.type}`);
  }
}

function processTags(nodes: IntermediateDocument): Document | ParseError {
  const result: Document = [];

  for (const node of nodes) {
    if (!Array.isArray(node)) {
      const children = processTags(node.children);
      if (!Array.isArray(children)) {
        return children;
      }
      result.push({
        type: "section",
        line: node.line,
        col: node.col,
        title: node.title,
        id: node.id,
        children,
      });
    } else {
      const toPush = processInlineTags(node);
      if (!Array.isArray(toPush)) {
        return toPush;
      }
      result.push(...toPush);
    }
  }

  return result;
}

function processInlineTags(
  nodes: IntermediateInlineNode[]
): InlineNode[] | ParseError {
  const result: InlineNode[] = [];
  const tagStack: IntermediateTag[] = [];

  for (const node of nodes) {
    if (node.type === "tag") {
      // Add to parent tag or result
      if (tagStack.length > 0) {
        const parentTag = tagStack[tagStack.length - 1];
        parentTag.children.push(node);
      } else {
        result.push(node);
      }

      // Push to stack if not self-closing
      if (!node.selfClose) {
        tagStack.push(node);
      }
    } else if (node.type === "tagEnd") {
      // Close matching tag
      if (tagStack[tagStack.length - 1]?.name !== node.name) {
        return {
          tokenNear: node.closingToken,
          message: "Unmatched tag",
        };
      }
      tagStack.pop();
    } else if (node.type === "text" || node.type === "codeBlock") {
      // Add text/code block to parent tag or result
      if (tagStack.length > 0) {
        const parentTag = tagStack[tagStack.length - 1];
        parentTag.children.push(node);
      } else {
        result.push(node);
      }
    }
  }

  if (tagStack.length > 0) {
    return {
      tokenNear: tagStack[tagStack.length - 1].openingToken,
      message: "Unclosed tag",
    };
  }

  return result;
}

export function parse(tokens: Token[]): Document | ParseError {
  // First pass: Build section hierarchy
  const sectionResult = buildSectionHierarchy(tokens);
  if ("tokenNear" in sectionResult) {
    return sectionResult;
  }

  // Second pass: Process tags within sections
  return processTags(sectionResult);
}

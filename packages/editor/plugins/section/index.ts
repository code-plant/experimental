import {
  Document,
  NodeBase,
  NodeText,
  ValidationError,
} from "@this-project/editor-core-types";
import { Result } from "@this-project/util-common-types";

interface SectionNode<T extends NodeBase> extends NodeBase {
  type: "section";
  title: string;
  id?: string;
  children: T[];
}

export type SectionPluginResultNode<T extends NodeBase> =
  | T
  | NodeText
  | SectionNode<SectionPluginResultNode<T>>;

export const SectionPlugin = <T extends NodeBase>(
  document: Document<T | NodeText>
): Result<
  Document<SectionPluginResultNode<T>>,
  ValidationError<T | NodeText>
> => {
  const result: Document<SectionPluginResultNode<T>> = [];
  const stack: SectionNode<SectionPluginResultNode<T>>[] = [];
  let error: ValidationError<T | NodeText> | null = null;
  document.forEach((node) => {
    if (error) {
      return;
    }
    if (is<NodeText>(node, "text")) {
      const buffer: string[] = [];
      let lineNum = node.line;
      let col = node.col;
      node.content.split("\n").forEach((line, i) => {
        if (error) {
          return;
        }
        if (line.match(/^#+(?: .|$)/)) {
          // Section
          if (buffer.length) {
            (stack[stack.length - 1]?.children ?? result).push(<NodeText>{
              type: "text",
              content: buffer.join("\n"),
              line: lineNum,
              col,
            });
            buffer.length = 0;
            lineNum = node.line + i;
            col = 0;
          }

          let match: RegExpMatchArray | null;
          if ((match = line.match(/^(#+)$/))) {
            // Explicitly Closing Section
            const level = match[1].length;
            if (stack.length < level) {
              error = {
                node,
                message: `Explicitly closing section level ${level} is invalid. Current section level is ${stack.length}.`,
              };
              return;
            }
            while (stack.length >= level) {
              stack.pop();
            }
          } else if ((match = line.match(/^(#+) (.+) \{\#(.*?)\}$/))) {
            // Section Start With Custom ID
            const level = match[1].length;
            const title = match[2];
            const id = match[3];
            if (stack.length + 1 < level) {
              error = {
                node,
                message: `Starting section with level ${level} is invalid. Current section level is ${stack.length}.`,
              };
              return;
            }
            while (stack.length >= level) {
              stack.pop();
            }
            const sectionNode: SectionNode<SectionPluginResultNode<T>> = {
              type: "section",
              title,
              id,
              children: [],
              line: node.line + i,
              col: 0,
            };
            (stack[stack.length - 1]?.children ?? result).push(sectionNode);
            stack.push(sectionNode);
          } else {
            // Section Start Without Custom ID
            match = line.match(/^(#+) (.+)$/)!;
            const level = match[1].length;
            const title = match[2];
            if (stack.length + 1 < level) {
              error = {
                node,
                message: `Starting section with level ${level} is invalid. Current section level is ${stack.length}.`,
              };
              return;
            }
            while (stack.length >= level) {
              stack.pop();
            }
            const sectionNode: SectionNode<SectionPluginResultNode<T>> = {
              type: "section",
              title,
              children: [],
              line: node.line + i,
              col: 0,
            };
            (stack[stack.length - 1]?.children ?? result).push(sectionNode);
            stack.push(sectionNode);
          }
        } else if (line.match(/^\\#/)) {
          // Escaped \#
          buffer.push(line.slice(1));
        } else {
          // Normal
          buffer.push(line);
        }
      });
      if (buffer.length) {
        (stack[stack.length - 1]?.children ?? result).push(<NodeText>{
          type: "text",
          content: buffer.join("\n"),
          line: lineNum,
          col,
        });
      }
    } else {
      (stack[stack.length - 1]?.children ?? result).push(node);
    }
  });
  if (error) {
    return {
      type: "error",
      error,
    };
  }
  return {
    type: "ok",
    value: result,
  };
};

function is<T extends NodeBase>(value: NodeBase, type: T["type"]): value is T {
  return value.type === type;
}

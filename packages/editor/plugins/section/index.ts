import {
  Document,
  NodeBase,
  NodeTag,
  NodeText,
  ValidationError,
} from "@this-project/editor-core-types";
import { is } from "@this-project/editor-plugins-util";
import { Result } from "@this-project/util-types-common";

export type SectionPluginResultNode<T extends NodeBase> =
  | T
  | NodeText
  | NodeTag<SectionPluginResultNode<T>>;

export const SectionPlugin = <T extends NodeBase>(
  document: Document<SectionPluginResultNode<T>>,
): Result<
  Document<SectionPluginResultNode<T>>,
  ValidationError<NodeTag<SectionPluginResultNode<T>>>
> => {
  const result: Document<SectionPluginResultNode<T>> = [];
  const stack: NodeTag<SectionPluginResultNode<T>>[] = [];
  let error: ValidationError<NodeText> | null = null;
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
            const [, levelString] = match as [string, string];
            const level = levelString.length;
            if (stack.length < level) {
              error = {
                node,
                message: `Explicitly closing section level ${String(level)} is invalid. Current section level is ${String(stack.length)}.`,
              };
              return;
            }
            while (stack.length >= level) {
              stack.pop();
            }
          } else if ((match = line.match(/^(#+) (.+) \{#(.*?)\}$/))) {
            // Section Start With Custom ID
            const [, levelString, title, id] = match as [
              string,
              string,
              string,
              string,
            ];
            const level = levelString.length;
            if (stack.length + 1 < level) {
              error = {
                node,
                message: `Starting section with level ${String(level)} is invalid. Current section level is ${String(stack.length)}.`,
              };
              return;
            }
            while (stack.length >= level) {
              stack.pop();
            }
            const sectionNode: NodeTag<SectionPluginResultNode<T>> = {
              type: "tag",
              name: "section",
              attrs: {
                title,
                id,
              },
              children: [],
              line: node.line + i,
              col: 0,
            };
            (stack[stack.length - 1]?.children ?? result).push(sectionNode);
            stack.push(sectionNode);
          } else {
            // Section Start Without Custom ID
            match = line.match(/^(#+) (.+)$/);
            const [, levelString, title] = match as [string, string, string];
            const level = levelString.length;
            if (stack.length + 1 < level) {
              error = {
                node,
                message: `Starting section with level ${String(level)} is invalid. Current section level is ${String(stack.length)}.`,
              };
              return;
            }
            while (stack.length >= level) {
              stack.pop();
            }
            const sectionNode: NodeTag<SectionPluginResultNode<T>> = {
              type: "tag",
              name: "section",
              attrs: {
                title,
              },
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

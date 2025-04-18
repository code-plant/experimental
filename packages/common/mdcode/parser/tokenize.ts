import type { Token } from "./Token";

export interface TokenizeError {
  line: number;
  col: number;
  message: string;
}

type State = StateText | StateCodeBlock | StateTag;

interface StateText {
  type: "text";
  line: number;
  col: number;
  content: string[];
}

interface StateCodeBlock {
  type: "codeBlock";
  line: number;
  precedingWhitespaces: string;
  fence: string;
  lang: string;
  content: string[];
}

interface StateTag {
  type: "tag";
  line: number;
  col: number;
  name: string;
  defaultAttr?: string;
  attrs: Partial<Record<string, string | true>>;
}

export function tokenize(source: string): Token[] | TokenizeError {
  const lines = source.split(/\r?\n/);
  const tokens: Token[] = [];

  let lineNum = 0;
  let state: State | undefined;

  for (const line of lines) {
    lineNum++;

    // Code Block Body
    if (state?.type === "codeBlock") {
      if (line === `${state.precedingWhitespaces}${state.fence}`) {
        tokens.push({
          type: "block",
          line: state.line,
          col: state.precedingWhitespaces.length,
          lang: state.lang,
          content: state.content.join("\n"),
        });
        state = undefined;
      } else if (!line) {
        state.content.push("");
      } else if (!line.startsWith(state.precedingWhitespaces)) {
        return {
          line: lineNum,
          col: 0,
          message: "Preceding whitespaces mismatch",
        };
      } else {
        state.content.push(line.slice(state.precedingWhitespaces.length));
      }
      continue;
    }

    if (!state || state.type === "text") {
      // Code Block Start
      const codeMatch = line.match(/^(\s*)(`{3,})(.*)$/);
      if (codeMatch) {
        if (state) {
          tokens.push({
            type: "text",
            line: state.line,
            col: state.col,
            value: state.content.join("\n"),
          });
        }
        const [, precedingWhitespaces, fence, lang] = codeMatch;
        state = {
          type: "codeBlock",
          line: lineNum,
          precedingWhitespaces,
          fence,
          lang,
          content: [],
        };
        continue;
      }

      // Section End
      if (line.match(/^#+$/)) {
        if (state) {
          tokens.push({
            type: "text",
            line: state.line,
            col: state.col,
            value: state.content.join("\n"),
          });
          state = undefined;
        }

        tokens.push({
          type: "sectionEnd",
          line: lineNum,
          col: 0,
          depth: line.length,
        });
        continue;
      }

      // Section Start
      const headingMatch = line.match(/^(#+) (.*?)(?: \{#([-a-zA-Z0-9]+)\})?$/);
      if (headingMatch) {
        if (state) {
          tokens.push({
            type: "text",
            line: state.line,
            col: state.col,
            value: state.content.join("\n"),
          });
          state = undefined;
        }

        const [, hashes, title, id] = headingMatch;
        const depth = hashes.length;
        tokens.push({
          type: "sectionStart",
          line: lineNum,
          col: 0,
          title,
          id,
          depth,
          content: [],
        });
        continue;
      }
    }

    let left = line;
    let skipped = 0;

    while (left) {
      // Tag Attributes and Closing
      if (state?.type === "tag") {
        let match: RegExpMatchArray | null;
        while (
          (match = left.match(
            /^(\s*)([a-zA-Z0-9-]+(?:=(?:"(?:(?:\\.)|[^"\\])*"|[a-zA-Z0-9-]*))?)((?:[\]\s\/]|$).*)$/
          ))
        ) {
          const [, spaces, attr, rest] = match;
          const parsedAttr = parseAttr(attr, lineNum, skipped);
          if (!Array.isArray(parsedAttr)) {
            return parsedAttr;
          }
          const [name, value] = parsedAttr;
          if (state.attrs[name] !== undefined) {
            return {
              line: lineNum,
              col: skipped,
              message: `Duplicate argument: ${name}`,
            };
          }
          state.attrs[name] = value;
          skipped += spaces.length + attr.length;
          left = rest;
        }

        match = left.match(/^(\s*)(\/?)\](.*)$/);
        if (match) {
          const [, spaces, close, rest] = match;
          tokens.push({
            type: "tagStart",
            line: state.line,
            col: state.col,
            name: state.name,
            defaultAttr: state.defaultAttr,
            attrs: state.attrs,
            selfClose: close.length === 1,
          });
          state = undefined;
          skipped += spaces.length + close.length + 1;
          left = rest;
        } else if (left.trim().length) {
          return {
            line: lineNum,
            col: skipped,
            message: `Unrecognized attribute: ${left}`,
          };
        } else {
          // left.trim() === ""
          break;
        }
      }
      // now state?.type is undefined or "text"

      // Text Mode
      let currentLine: string[] = [];
      let col = skipped;
      while (left) {
        if (!left.match(/^\[\/?[a-zA-Z0-9-]/)) {
          const currentChar = left[0];
          if (currentChar === "\\" && (left[1] === "\\" || left[1] === "[")) {
            currentLine.push(left[1]);
            skipped += 2;
            left = left.slice(2);
          } else {
            currentLine.push(left[0]);
            skipped += 1;
            left = left.slice(1);
          }
        } else if (left[1] === "/") {
          const match = left.match(/^\[\/([a-zA-Z0-9-]+)\](.*)$/);
          if (!match) {
            return {
              line: lineNum,
              col: skipped,
              message: `Unrecognized tag close: ${left}`,
            };
          }
          const [, name, rest] = match;
          if (currentLine.length) {
            if (!state) {
              state = {
                type: "text",
                line: lineNum,
                col,
                content: [],
              };
            }
            state.content.push(currentLine.join(""));
            currentLine.length = 0;
          }
          if (state) {
            tokens.push({
              type: "text",
              line: state.line,
              col: state.col,
              value: state.content.join("\n"),
            });
          }
          state = undefined;
          tokens.push({
            type: "tagEnd",
            line: lineNum,
            col: skipped,
            name,
          });
          left = rest;
          skipped += name.length + 3;
        } else {
          const match = left.match(
            /^\[([a-zA-Z0-9-]+(?:=(?:"(?:(?:\\.)|[^"\\])*"|[a-zA-Z0-9-]*))?)((?:[\]\s\/]|$).*)$/
          );
          if (!match) {
            return {
              line: lineNum,
              col: skipped,
              message: `Unrecognized tag open: ${left}`,
            };
          }
          const [, attr, rest] = match;
          const parsedAttr = parseAttr(attr, lineNum, skipped);
          if (!Array.isArray(parsedAttr)) {
            return parsedAttr;
          }
          if (currentLine.length) {
            if (!state) {
              state = {
                type: "text",
                line: lineNum,
                col,
                content: [],
              };
            }
            state.content.push(currentLine.join(""));
            currentLine.length = 0;
          }
          const [name, value] = parsedAttr;
          if (state) {
            tokens.push({
              type: "text",
              line: state.line,
              col: state.col,
              value: state.content.join("\n"),
            });
          }
          state = {
            type: "tag",
            line: lineNum,
            col,
            name,
            defaultAttr: value === true ? undefined : value,
            attrs: {},
          };
          left = rest;
          skipped += 1 + attr.length;
          break; // Return to Tag Attributes and Closing
        }
      }
      if (currentLine.length && state?.type !== "tag") {
        if (!state) {
          state = {
            type: "text",
            line: lineNum,
            col,
            content: [],
          };
        }
        state.content.push(currentLine.join(""));
        currentLine.length = 0;
      }
    }
  }

  // If EOF reached and still in code block
  switch (state?.type) {
    case "codeBlock":
      return {
        line: state.line,
        col: state.precedingWhitespaces.length,
        message: "Unterminated code block",
      };
    case "text":
      tokens.push({
        type: "text",
        line: state.line,
        col: state.col,
        value: state.content.join("\n"),
      });
      break;
    case "tag":
      return {
        line: state.line,
        col: state.col,
        message: "Unterminated tag",
      };
  }

  return tokens;
}

function parseAttr(
  attr: string,
  line: number,
  col: number
): [name: string, value: string | true] | TokenizeError {
  const match = attr.match(/^([a-zA-Z0-9-]+)=(.*?)$/);
  if (!match) {
    return [attr, true];
  }
  const [, name, value] = match;
  const parsedValue = parseAttrValue(value, line, col + name.length + 1);
  if (typeof parsedValue === "object") {
    return parsedValue;
  }
  return [name, parsedValue];
}

function parseAttrValue(
  value: string,
  line: number,
  col: number
): string | TokenizeError {
  if (!value.startsWith('"')) {
    return value;
  }
  value = value.slice(1, -1);
  let result: string[] = [];
  let state = false;
  for (const char of value) {
    col++;
    if (!state) {
      if (char === "\\") {
        state = true;
      } else {
        result.push(char);
      }
    } else {
      switch (char) {
        case "\\":
        case '"':
          result.push(char);
          break;
        case "n":
          result.push("\n");
          break;
        default:
          return {
            line,
            col,
            message: `Unrecognized escape sequence: \\${char}`,
          };
      }
    }
  }
  return result.join("");
}

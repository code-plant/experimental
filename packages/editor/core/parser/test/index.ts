import { tokenize } from "../tokenize";

declare const console: {
  log: (...args: any[]) => void;
};

console.log(
  tokenize(`

test

  \`\`\`lang
  content

  third-line
  \`\`\`

test

`)
);

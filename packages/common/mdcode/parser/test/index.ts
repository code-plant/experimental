import { tokenize } from "../tokenize";

const { console } = globalThis as unknown as {
  console: { log: (...args: any[]) => void };
};

console.log(
  tokenize(`

    Hello world![b]42[/b]
    [multi-line
    ]
    [multi-line=xXx
    xXx1=xXx xXx2="xXx" xXx3="\\\\\\"\\\\"
    /]haha[/multi-line]

`)
);

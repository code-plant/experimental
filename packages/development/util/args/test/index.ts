import { Args } from "..";

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a !== "object" || typeof b !== "object" || a == null || b == null)
    return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}

function assertDeepEqual(a: any, b: any) {
  if (!deepEqual(a, b)) {
    console.log({ a, b });
    throw new Error("Test failed");
  }
}

const args = Args.instance
  .positional(Args.STRING)
  .boolean("normal", "n")
  .boolean("depth", "d")
  .boolean("no-suffix")
  .keyword(Args.STRING, "output", "o");

assertDeepEqual(args.parse(["-ndooutput", "--", "hello", "--world"]), {
  type: "ok",
  positional: ["hello"],
  keywords: { normal: true, depth: true, output: "output" },
  extra: ["--world"],
});

// =============================================================================
// below is by ChatGPT
// =============================================================================

// Case: Only positional args
assertDeepEqual(args.parse(["file.txt", "another.txt"]), {
  type: "ok",
  positional: ["file.txt"],
  keywords: {},
  extra: ["another.txt"],
});

// Case: Long form booleans and keyword
assertDeepEqual(
  args.parse(["--normal", "--depth", "--output", "out.txt", "main.c"]),
  {
    type: "ok",
    positional: ["main.c"],
    keywords: { normal: true, depth: true, output: "out.txt" },
    extra: [],
  }
);

// Case: Mixed short and long flags
assertDeepEqual(
  args.parse(["-n", "--depth", "--output=build.js", "index.ts"]),
  {
    type: "ok",
    positional: ["index.ts"],
    keywords: { normal: true, depth: true, output: "build.js" },
    extra: [],
  }
);

// Case: Unrecognized option after `--`
assertDeepEqual(args.parse(["--output", "result", "--", "--bad"]), {
  type: "ok",
  positional: ["--bad"],
  keywords: { output: "result" },
  extra: [],
});

// Case: Boolean flag at end
assertDeepEqual(args.parse(["-n", "hello", "-d"]), {
  type: "ok",
  positional: ["hello"],
  keywords: { normal: true, depth: true },
  extra: [],
});

// Case: Combined short flags and output
assertDeepEqual(args.parse(["-ndooutput.txt", "input.txt"]), {
  type: "ok",
  positional: ["input.txt"],
  keywords: { normal: true, depth: true, output: "output.txt" },
  extra: [],
});

// Case: `--no-suffix` usage
assertDeepEqual(args.parse(["--no-suffix", "file"]), {
  type: "ok",
  positional: ["file"],
  keywords: { "no-suffix": true },
  extra: [],
});

export class Args<
  const requiredArgsCount extends number,
  const args extends unknown[],
  const kwargs extends Partial<Record<string, unknown>>,
  const short extends Partial<Record<string, string>>,
  const extra extends unknown
> {
  public static readonly instance: Args<
    0,
    [],
    { help: never; version: never },
    { h: "help"; v: "version" },
    never
  > = new Args(0, [], {} as any, {} as any, undefined);

  private constructor(
    private readonly requiredArgsCount: number,
    private readonly _positional: unknown[],
    private readonly _keyword: Partial<
      Record<string, BooleanConstructor | ((value: string) => any)>
    >,
    private readonly _short: short,
    private readonly _extra: [extra] extends [never]
      ? undefined
      : (value: string) => extra
  ) {}

  public positional<T>(
    parse: (value: string) => T,
    required?: true
  ): args["length"] extends requiredArgsCount
    ? [extra] extends [never]
      ? Args<[...args, T]["length"], [...args, T], kwargs, short, extra>
      : never
    : never;
  public positional<T>(
    parse: (value: string) => T,
    required: false
  ): [extra] extends [never]
    ? Args<requiredArgsCount, [...args, optional?: T], kwargs, short, extra>
    : never;
  public positional<T>(
    parse: (value: string) => T,
    required = false
  ): Args<any, any[], kwargs, short, extra> {
    if (this._extra) {
      throw new Error(
        "Extra and optional positional arguments are mutually exclusive"
      );
    }
    return new Args(
      this.requiredArgsCount + +required,
      [...this._positional, parse],
      this._keyword,
      this._short,
      this._extra
    );
  }

  public keyword<T, const L extends string>(
    parse: (value: string) => T,
    long: L
  ): L extends ""
    ? never
    : L extends keyof kwargs
    ? never
    : ToLetters<L> extends Allowed
    ? Args<
        requiredArgsCount,
        args,
        kwargs & Partial<Record<L, T>>,
        short,
        extra
      >
    : never;
  public keyword<T, const L extends string, const S extends string>(
    parse: (value: string) => T,
    long: L,
    short: S
  ): L extends ""
    ? never
    : L extends `-${string}`
    ? never
    : L extends keyof kwargs
    ? never
    : S extends ""
    ? never
    : S extends `-${string}`
    ? never
    : S extends keyof short
    ? never
    : S extends `${string}${infer I}`
    ? I extends ""
      ? ToLetters<L> extends Allowed
        ? S extends Allowed
          ? Args<
              requiredArgsCount,
              args,
              kwargs & Partial<Record<L, T>>,
              short & Partial<Record<S, L>>,
              extra
            >
          : never
        : never
      : never
    : never;
  public keyword(
    parse: (value: string) => unknown,
    long: string,
    short?: string
  ): Args<requiredArgsCount, any[], any, any, extra> {
    let newShort = this._short;
    if (short !== undefined) {
      if (short.length !== 1) {
        throw new Error("Short keyword parameter length must be 1");
      }
      if (short in newShort) {
        throw new Error(
          `Duplicate short parameter "${short}": "${newShort[short]}" and "${long}"`
        );
      }
      if ((ALLOWED as readonly string[]).indexOf(short) === -1) {
        throw new Error(`Invalid charactor "${short}"`);
      }
      if (short === "-") {
        throw new Error('Short keyword parameter cannot be "-".');
      }
      newShort = { ...newShort, [short]: long };
    }
    let newKeyword = this._keyword;
    if (long.length === 0) {
      throw new Error("Long keyword parameter length must be greater than 0");
    }
    if (long in newKeyword) {
      throw new Error(`Duplicate long parameter: ${long}`);
    }
    if (
      long
        .split("")
        .some((ch) => (ALLOWED as readonly string[]).indexOf(ch) === -1)
    ) {
      throw new Error(
        `Invalid charactor "${long
          .split("")
          .find(
            (ch) => (ALLOWED as readonly string[]).indexOf(ch) === -1
          )}" in "${long}"`
      );
    }
    if (long.startsWith("-")) {
      throw new Error('Long keyword parameter cannot starts with "-".');
    }
    newKeyword = { ...newKeyword, [long]: parse };
    return new Args(
      this.requiredArgsCount,
      this._positional,
      newKeyword,
      newShort,
      this._extra
    );
  }

  public extra<const E>(
    parser: (str: string) => E
  ): args["length"] extends requiredArgsCount
    ? [extra] extends [never]
      ? Args<requiredArgsCount, args, kwargs, short, E>
      : never
    : never {
    if (this._extra) {
      throw new Error("Extra parser registered multiple times");
    }
    if (this._positional.length !== this.requiredArgsCount) {
      throw new Error(
        "Extra and optional positional arguments are mutually exclusive"
      );
    }
    return new Args(
      this.requiredArgsCount,
      this._positional,
      this._keyword,
      this._short,
      parser as any
    ) as any;
  }

  public boolean<const L extends string>(
    long: L
  ): L extends ""
    ? never
    : L extends `-${string}`
    ? never
    : L extends keyof kwargs
    ? never
    : ToLetters<L> extends Allowed
    ? Args<
        requiredArgsCount,
        args,
        kwargs & Partial<Record<L, true | undefined>>,
        short,
        extra
      >
    : never;
  public boolean<const L extends string, const S extends string>(
    long: L,
    short: S
  ): L extends ""
    ? never
    : L extends `-${string}`
    ? never
    : L extends keyof kwargs
    ? never
    : S extends ""
    ? never
    : S extends `-${string}`
    ? never
    : S extends keyof short
    ? never
    : S extends `${string}${infer I}`
    ? I extends ""
      ? ToLetters<L> extends Allowed
        ? S extends Allowed
          ? Args<
              requiredArgsCount,
              args,
              kwargs & Partial<Record<L, true | undefined>>,
              short & Partial<Record<S, L>>,
              extra
            >
          : never
        : never
      : never
    : never;
  public boolean(
    long: string,
    short?: string
  ): Args<requiredArgsCount, any[], any, any, extra> {
    let newShort = this._short;
    if (short !== undefined) {
      if (short.length !== 1) {
        throw new Error("Short keyword parameter length must be 1");
      }
      if (short in newShort) {
        throw new Error(
          `Duplicate short parameter "${short}": "${newShort[short]}" and "${long}"`
        );
      }
      if ((ALLOWED as readonly string[]).indexOf(short) === -1) {
        throw new Error(`Invalid charactor "${short}"`);
      }
      if (short === "-") {
        throw new Error('Short keyword parameter cannot be "-".');
      }
      newShort = { ...newShort, [short]: long };
    }
    let newKeyword = this._keyword;
    if (long.length === 0) {
      throw new Error("Long keyword parameter length must be greater than 0");
    }
    if (long in newKeyword) {
      throw new Error(`Duplicate long parameter: ${long}`);
    }
    if (
      long
        .split("")
        .some((ch) => (ALLOWED as readonly string[]).indexOf(ch) === -1)
    ) {
      throw new Error(
        `Invalid charactor "${long
          .split("")
          .find(
            (ch) => (ALLOWED as readonly string[]).indexOf(ch) === -1
          )}" in "${long}"`
      );
    }
    if (long.startsWith("-")) {
      throw new Error('Long keyword parameter cannot starts with "-".');
    }
    newKeyword = { ...newKeyword, [long]: Boolean };
    return new Args(
      this.requiredArgsCount,
      this._positional,
      newKeyword,
      newShort,
      this._extra
    );
  }

  public static STRING = (value: string) => value;
  public static INT = (value: string) => parseInt(value, 10);
  public static FLOAT = (value: string) => parseFloat(value);

  // parse function is by ChatGPT (implementing it is too boring)
  public parse(argv: string[]):
    | { type: "help" }
    | { type: "version" }
    | {
        type: "ok";
        positional: args;
        keywords: Omit<kwargs, "help" | "version">;
        extra: extra[];
      }
    | { type: "error"; reason: string } {
    const positionalValues: any[] = [];
    const keywordValues: Record<string, unknown> = {};
    const extra: extra[] = [];

    let posIndex = 0;
    let parsingFlags = true; // true until we see `--`

    for (let i = 0; i < argv.length; i++) {
      let current = argv[i];

      // If we see `--`, disable flag parsing and move on to next token (DON’T add `--` itself to arguments)
      if (parsingFlags && current === "--") {
        parsingFlags = false;
        continue;
      }

      // After `--`, treat the token as positional/extra (ignore leading dashes)
      if (!parsingFlags) {
        if (posIndex < this._positional.length) {
          const parser = this._positional[posIndex];
          try {
            positionalValues.push((parser as any)(current));
          } catch (err) {
            return {
              type: "error",
              reason: err instanceof Error ? err.message : String(err),
            };
          }
          posIndex++;
        } else {
          if (!this._extra) {
            return {
              type: "error",
              reason: "Extra positional argument given",
            };
          }
          try {
            extra.push(this._extra!(current));
          } catch (err) {
            return {
              type: "error",
              reason: err instanceof Error ? err.message : String(err),
            };
          }
        }
        continue; // move on to next token
      }

      // ========================
      // Normal flags / arguments
      // ========================

      // 1) Check for --help / -h
      if (current === "--help" || current === "-h") {
        return { type: "help" };
      }
      // 2) Check for --version / -v
      if (current === "--version" || current === "-v") {
        return { type: "version" };
      }

      // 3) Single dash "-" is invalid (unless after `--`, which we’ve handled above)
      if (current === "-") {
        return {
          type: "error",
          reason: "Single dash '-' is invalid unless after `--`.",
        };
      }

      // 4) LONG FLAGS with possible `=`, e.g. --width=128 or --width
      if (current.startsWith("--")) {
        const eqIndex = current.indexOf("=");
        let longFlag = "";
        let potentialValue: string | undefined;

        if (eqIndex >= 0) {
          longFlag = current.slice(2, eqIndex);
          potentialValue = current.slice(eqIndex + 1);
        } else {
          longFlag = current.slice(2);
        }

        // If not in _keyword, return error
        if (!(longFlag in this._keyword)) {
          return {
            type: "error",
            reason: `Unrecognized parameter: --${longFlag}`,
          };
        }

        const parserOrBoolean = this._keyword[longFlag];
        if (parserOrBoolean === Boolean) {
          // If we have an '=' but parser is boolean => error
          if (typeof potentialValue === "string" && potentialValue.length) {
            return {
              type: "error",
              reason: `Boolean flag "--${longFlag}" cannot accept a value: "${potentialValue}".`,
            };
          }
          keywordValues[longFlag] = true;
        } else {
          let valueStr: string;
          if (potentialValue !== undefined) {
            // use the part after '='
            valueStr = potentialValue;
          } else {
            // consume next token
            i++;
            if (i >= argv.length) {
              return {
                type: "error",
                reason: `Expected value after --${longFlag}`,
              };
            }
            valueStr = argv[i];
          }
          try {
            keywordValues[longFlag] = parserOrBoolean!(valueStr);
          } catch (err) {
            return {
              type: "error",
              reason: err instanceof Error ? err.message : String(err),
            };
          }
        }
      }

      // 5) SHORT FLAGS, e.g. -w128 or -abc
      else if (current.startsWith("-")) {
        const shortFlags = current.slice(1);
        if (!shortFlags.length) {
          return {
            type: "error",
            reason: "Single dash '-' is invalid unless after `--`.",
          };
        }

        let sfIndex = 0;
        while (sfIndex < shortFlags.length) {
          const shortChar = shortFlags[sfIndex];
          if (!(shortChar in this._short)) {
            return {
              type: "error",
              reason: `Unrecognized short parameter: -${shortChar}`,
            };
          }

          const longKey = this._short[shortChar]!;
          const parserOrBoolean = this._keyword[longKey];

          if (parserOrBoolean === Boolean) {
            keywordValues[longKey] = true;
            sfIndex++;
          } else {
            // If there's any remainder in this chunk, treat it as the value
            const remainder = shortFlags.slice(sfIndex + 1);
            if (remainder) {
              try {
                keywordValues[longKey] = parserOrBoolean!(remainder);
              } catch (err) {
                return {
                  type: "error",
                  reason: err instanceof Error ? err.message : String(err),
                };
              }
              sfIndex = shortFlags.length;
            } else {
              // Otherwise consume next argv token
              i++;
              if (i >= argv.length) {
                return {
                  type: "error",
                  reason: `Expected value after -${shortChar}`,
                };
              }
              try {
                keywordValues[longKey] = parserOrBoolean!(argv[i]);
              } catch (err) {
                return {
                  type: "error",
                  reason: err instanceof Error ? err.message : String(err),
                };
              }
            }
            // break from the short flag string, we used up the rest for the value
            break;
          }
        }
      }

      // 6) If not a flag, interpret as positional
      else {
        if (posIndex < this._positional.length) {
          const parser = this._positional[posIndex];
          try {
            positionalValues.push((parser as any)(current));
          } catch (err) {
            return {
              type: "error",
              reason: err instanceof Error ? err.message : String(err),
            };
          }
          posIndex++;
        } else {
          if (!this._extra) {
            return {
              type: "error",
              reason: "Extra positional argument given",
            };
          }
          try {
            extra.push(this._extra!(current));
          } catch (err) {
            return {
              type: "error",
              reason: err instanceof Error ? err.message : String(err),
            };
          }
        }
      }
    } // end for-loop

    // 7) After loop, check if we used all required positional parsers
    if (posIndex <= this.requiredArgsCount) {
      return {
        type: "error",
        reason: "Positional arguments mismatch",
      };
    }

    return {
      type: "ok",
      positional: positionalValues as any,
      keywords: keywordValues as any,
      extra,
    };
  }
}

type ToLetters<S extends string, R = never> = S extends ""
  ? R
  : S extends `${infer I}${infer J}`
  ? ToLetters<J, R | I>
  : never;
type Allowed = (typeof ALLOWED)[number];

// prettier-ignore
export const ALLOWED = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  '-',
] as const;

export class Args<
  const args extends any[],
  const kwargs extends Partial<Record<string, any>>,
  const short extends Partial<Record<string, string>>
> {
  public static instance: Args<
    [],
    { help: never; version: never },
    { h: "help"; v: "version" }
  > = new Args([], {} as any, {} as any);

  private constructor(
    private readonly _positional: any[],
    private readonly _keyword: Partial<
      Record<string, BooleanConstructor | ((value: string) => any)>
    >,
    private readonly _short: short
  ) {}

  public positional<T>(
    parse: (value: string) => T
  ): Args<[...args, T], kwargs, short> {
    return new Args([...this._positional, parse], this._keyword, this._short);
  }

  public keyword<T, const L extends string>(
    parse: (value: string) => T,
    long: L
  ): L extends ""
    ? never
    : L extends keyof kwargs
    ? never
    : ToLetters<L> extends Allowed
    ? Args<args, kwargs & Record<L, T>, short>
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
    : S extends `${infer _}${infer I}`
    ? I extends ""
      ? ToLetters<L> extends Allowed
        ? S extends Allowed
          ? Args<args, kwargs & Record<L, T>, short & Record<S, L>>
          : never
        : never
      : never
    : ToLetters<L> extends Allowed
    ? S extends Allowed
      ? Args<args, kwargs & Record<L, T>, short & Record<S, L>>
      : never
    : never;
  public keyword(
    parse: (value: string) => unknown,
    long: string,
    short?: string
  ): Args<any[], any, any> {
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
    return new Args(this._positional, newKeyword, newShort);
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
    ? Args<args, kwargs & Record<L, true | undefined>, short>
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
    : S extends `${infer _}${infer I}`
    ? I extends ""
      ? ToLetters<L> extends Allowed
        ? S extends Allowed
          ? Args<
              args,
              kwargs & Record<L, true | undefined>,
              short & Record<S, L>
            >
          : never
        : never
      : never
    : ToLetters<L> extends Allowed
    ? S extends Allowed
      ? Args<args, kwargs & Record<L, true | undefined>, short & Record<S, L>>
      : never
    : never;
  public boolean(long: string, short?: string): Args<any[], any, any> {
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
    return new Args(this._positional, newKeyword, newShort);
  }

  public static STRING = (value: string) => value;
  public static INT = (value: string) => parseInt(value, 10);
  public static FLOAT = (value: string) => parseFloat(value);

  // parse function is by ChatGPT (implementing it is too boring)
  public parse(
    argv: string[]
  ):
    | { type: "help" }
    | { type: "version" }
    | { type: "ok"; positional: args; keywords: kwargs; extra: string[] }
    | { type: "error"; reason: string } {
    const positionalValues: any[] = [];
    const keywordValues: Record<string, unknown> = {};
    const extra: string[] = [];

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
            positionalValues.push(parser(current));
          } catch (err) {
            return {
              type: "error",
              reason: err instanceof Error ? err.message : String(err),
            };
          }
          posIndex++;
        } else {
          extra.push(current);
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
            positionalValues.push(parser(current));
          } catch (err) {
            return {
              type: "error",
              reason: err instanceof Error ? err.message : String(err),
            };
          }
          posIndex++;
        } else {
          extra.push(current);
        }
      }
    } // end for-loop

    // 7) After loop, check if we used all required positional parsers
    if (posIndex !== this._positional.length) {
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

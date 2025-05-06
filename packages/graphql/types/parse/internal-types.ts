import { ResultError, ResultOk } from "@this-project/util-types-common";

export type NameStart = Letter | "_";
export type NameContinue = Letter | Digit | "_";
export type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
export type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type Ignored = " " | "\t" | "\n" | ",";

export type TrimStart<S extends string> = S extends `${Ignored}${infer I}`
  ? TrimStart<I>
  : S extends `#${string}\n${infer I}`
  ? TrimStart<I>
  : S;

export type ExpectResult<T> = ExpectResultOk<T> | ExpectResultError;
export interface ExpectResultError extends ResultError<string> {
  on: string;
}
export interface ExpectResultOk<T> extends ResultOk<T> {
  rest: string;
}

import { Ensure, Result } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../internal-types";

export type ExpectString<S extends string> = S extends `"""${infer I}`
  ? InternalBlock<I, "">
  : S extends `"${infer I}`
  ? Internal<I, "">
  : Ensure<{ type: "error"; error: `string expected` }, ExpectResultError>;

type InternalBlock<
  S extends string,
  R extends string
> = S extends `${infer A}"""${infer B}`
  ? A extends `${infer C}\\`
    ? InternalBlock<B, `${R}${C}"""`>
    : Ensure<
        {
          type: "ok";
          value: PostProcessBlockString<`${R}${A}`>;
          rest: TrimStart<B>;
        },
        ExpectResultOk<string>
      >
  : Ensure<
      {
        type: "error";
        error: `unterminated block string`;
      },
      ExpectResultError
    >;

type PostProcessBlockString<S extends string> =
  /* // TODO: https://spec.graphql.org/October2021/#BlockStringValue() */ S;

type Internal<
  S extends string,
  R extends string
> = S extends `${infer A}"${infer B}`
  ? A extends `${string}\\`
    ? A extends `${string}\n${string}`
      ? Ensure<
          {
            type: "error";
            error: `unterminated string`;
          },
          ExpectResultError
        >
      : Internal<B, `${R}${A}\\"`>
    : A extends `${string}\n${string}`
    ? Ensure<
        {
          type: "error";
          error: `unterminated string`;
        },
        ExpectResultError
      >
    : Unescape<`${R}${A}`> extends infer I
    ? I extends { type: "ok"; value: infer I extends string }
      ? Ensure<
          { type: "ok"; value: I; rest: TrimStart<B> },
          ExpectResultOk<string>
        >
      : I
    : never
  : Ensure<
      {
        type: "error";
        error: `unterminated string`;
      },
      ExpectResultError
    >;

type Unescape<S extends string> = UnescapeInternal<S, "">;

type UnescapeMap = {
  '"': '"';
  "\\": "\\";
  "/": "/";
  b: "\b";
  f: "\f";
  n: "\n";
  r: "\r";
  t: "\t";
};

type UnescapeInternal<
  S extends string,
  R extends string
> = S extends `${infer A}\\${infer B}`
  ? B extends `${infer C extends keyof UnescapeMap}${infer D}`
    ? UnescapeInternal<D, `${R}${A}${UnescapeMap[C]}`>
    : B extends `u${infer C}`
    ? UnescapeInternal<C, `${R}${A}\\u`>
    : Ensure<
        { type: "error"; error: "Unknown escape sequence" },
        ExpectResultError
      >
  : Ensure<{ type: "ok"; value: `${R}${S}` }, Result<string>>;

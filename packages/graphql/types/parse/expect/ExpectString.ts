import { Ensure, Result } from "@this-project/util-types-common";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../internal-types";

export type ExpectString<
  S extends string,
  On extends string
> = S extends `"""${infer I}`
  ? InternalBlock<I, "", On>
  : S extends `"${infer I}`
  ? Internal<I, "", On>
  : Ensure<
      { type: "error"; error: `string expected`; on: On },
      ExpectResultError
    >;

type InternalBlock<
  S extends string,
  R extends string,
  On extends string
> = S extends `${infer A}"""${infer B}`
  ? A extends `${infer C}\\`
    ? InternalBlock<B, `${R}${C}"""`, On>
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
        on: On;
      },
      ExpectResultError
    >;

type PostProcessBlockString<S extends string> =
  /* // TODO: https://spec.graphql.org/October2021/#BlockStringValue() */ S;

type Internal<
  S extends string,
  R extends string,
  On extends string
> = S extends `${infer A}"${infer B}`
  ? A extends `${string}\\`
    ? A extends `${string}\n${string}`
      ? Ensure<
          {
            type: "error";
            error: `unterminated string`;
            on: On;
          },
          ExpectResultError
        >
      : Internal<B, `${R}${A}\\"`, On>
    : A extends `${string}\n${string}`
    ? Ensure<
        {
          type: "error";
          error: `unterminated string`;
          on: On;
        },
        ExpectResultError
      >
    : Unescape<`${R}${A}`, On> extends infer I
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
        on: On;
      },
      ExpectResultError
    >;

type Unescape<S extends string, On extends string> = UnescapeInternal<
  S,
  "",
  On
>;

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
  R extends string,
  On extends string
> = S extends `${infer A}\\${infer B}`
  ? B extends `${infer C extends keyof UnescapeMap}${infer D}`
    ? UnescapeInternal<D, `${R}${A}${UnescapeMap[C]}`, On>
    : B extends `u${infer C}`
    ? UnescapeInternal<C, `${R}${A}\\u`, On>
    : Ensure<
        { type: "error"; error: "Unknown escape sequence"; on: On },
        ExpectResultError
      >
  : Ensure<{ type: "ok"; value: `${R}${S}` }, Result<string>>;

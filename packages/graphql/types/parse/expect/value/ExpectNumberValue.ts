import { Ensure } from "@this-project/util-common-types";
import {
  Digit,
  ExpectResultError,
  ExpectResultOk,
  NameStart,
  TrimStart,
} from "../../internal-types";
import { NumberValue } from "../../types";

export type ExpectNumberValue<
  S extends string,
  On extends string
> = S extends `-${infer I}`
  ? InternalDigit<I, "-", On>
  : InternalDigit<S, "", On>;

type InternalDigit<
  S extends string,
  R extends string,
  On extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalDigitOptional<B, `${R}${A}`, On>
  : Ensure<
      { type: "error"; error: "Expected digit"; on: On },
      ExpectResultError
    >;

type InternalDigitOptional<
  S extends string,
  R extends string,
  On extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalDigitOptional<B, `${R}${A}`, On>
  : S extends `.${infer A}`
  ? InternalFractionalPart<A, `${R}.`, On>
  : S extends `${infer A extends "e" | "E"}${infer B}`
  ? InternalExponentSignPart<B, `${R}${A}`, On>
  : S extends `${NameStart}${string}`
  ? Ensure<
      { type: "error"; error: "Number cannot followed by NameStart"; on: On },
      ExpectResultError
    >
  : Validate<R, S, On>;

type InternalFractionalPart<
  S extends string,
  R extends string,
  On extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalFractionalPartOptional<B, `${R}${A}`, On>
  : Ensure<
      { type: "error"; error: "Expected digit after dot"; on: On },
      ExpectResultError
    >;

type InternalFractionalPartOptional<
  S extends string,
  R extends string,
  On extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalFractionalPartOptional<B, `${R}${A}`, On>
  : S extends `${"e" | "E"}${infer A}`
  ? InternalExponentSignPart<A, `${R}e`, On>
  : S extends `${NameStart}${string}`
  ? Ensure<
      { type: "error"; error: "Number cannot followed by NameStart"; on: On },
      ExpectResultError
    >
  : Validate<R, S, On>;

type InternalExponentSignPart<
  S extends string,
  R extends string,
  On extends string
> = S extends `${infer A extends "+" | "-"}${infer B}`
  ? InternalExponentPart<B, `${R}${A}`, On>
  : S extends `${infer A extends Digit}${infer B}`
  ? InternalExponentPartOptional<B, `${R}${A}`, On>
  : Ensure<
      {
        type: "error";
        error: "Expected digit after ExponentIndicator";
        on: On;
      },
      ExpectResultError
    >;

type InternalExponentPart<
  S extends string,
  R extends string,
  On extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalExponentPartOptional<B, `${R}${A}`, On>
  : Ensure<
      {
        type: "error";
        error: "Expected digit after ExponentIndicator";
        on: On;
      },
      ExpectResultError
    >;

type InternalExponentPartOptional<
  S extends string,
  R extends string,
  On extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalExponentPartOptional<B, `${R}${A}`, On>
  : S extends `${NameStart}${string}`
  ? Ensure<
      { type: "error"; error: "Number cannot followed by NameStart"; on: On },
      ExpectResultError
    >
  : Validate<R, S, On>;

type Validate<
  T extends string,
  R extends string,
  On extends string
> = T extends `0${Digit}${string}` | `-0${string}`
  ? Ensure<
      { type: "error"; error: "Invalid number literal"; on: On },
      ExpectResultError
    >
  : Ensure<
      { type: "ok"; value: { type: "number"; value: T }; rest: TrimStart<R> },
      ExpectResultOk<NumberValue>
    >;

import { Ensure } from "@this-project/common-util-types";
import {
  Digit,
  ExpectResultError,
  ExpectResultOk,
  NameStart,
  TrimStart,
} from "../../internal-types";
import { NumberValue } from "../../types";

export type ExpectNumberValue<S extends string> = S extends `-${infer I}`
  ? InternalDigit<I, "-">
  : InternalDigit<S, "">;

type InternalDigit<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalDigitOptional<B, `${R}${A}`>
  : Ensure<{ type: "error"; error: "Expected digit" }, ExpectResultError>;

type InternalDigitOptional<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalDigitOptional<B, `${R}${A}`>
  : S extends `.${infer A}`
  ? InternalFractionalPart<A, `${R}.`>
  : S extends `${infer A extends "e" | "E"}${infer B}`
  ? InternalExponentSignPart<B, `${R}${A}`>
  : S extends `${NameStart}${string}`
  ? Ensure<
      { type: "error"; error: "Number cannot followed by NameStart" },
      ExpectResultError
    >
  : ValidateResult<R, S>;

type InternalFractionalPart<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalFractionalPartOptional<B, `${R}${A}`>
  : Ensure<
      { type: "error"; error: "Expected digit after dot" },
      ExpectResultError
    >;

type InternalFractionalPartOptional<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalFractionalPartOptional<B, `${R}${A}`>
  : S extends `${"e" | "E"}${infer A}`
  ? InternalExponentSignPart<A, `${R}e`>
  : S extends `${NameStart}${string}`
  ? Ensure<
      { type: "error"; error: "Number cannot followed by NameStart" },
      ExpectResultError
    >
  : ValidateResult<R, S>;

type InternalExponentSignPart<
  S extends string,
  R extends string
> = S extends `${infer A extends "+" | "-"}${infer B}`
  ? InternalExponentPart<B, `${R}${A}`>
  : S extends `${infer A extends Digit}${infer B}`
  ? InternalExponentPartOptional<B, `${R}${A}`>
  : Ensure<
      { type: "error"; error: "Expected digit after ExponentIndicator" },
      ExpectResultError
    >;

type InternalExponentPart<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalExponentPartOptional<B, `${R}${A}`>
  : Ensure<
      { type: "error"; error: "Expected digit after ExponentIndicator" },
      ExpectResultError
    >;

type InternalExponentPartOptional<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? InternalExponentPartOptional<B, `${R}${A}`>
  : S extends `${NameStart}${string}`
  ? Ensure<
      { type: "error"; error: "Number cannot followed by NameStart" },
      ExpectResultError
    >
  : ValidateResult<R, S>;

type ValidateResult<T extends string, R extends string> = T extends
  | `0${Digit}${string}`
  | `-0${string}`
  ? Ensure<
      { type: "error"; error: "Invalid number literal" },
      ExpectResultError
    >
  : Ensure<
      { type: "ok"; value: { type: "number"; value: T }; rest: TrimStart<R> },
      ExpectResultOk<NumberValue>
    >;

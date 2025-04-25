import { Ensure } from "@this-project/util-common-types";
import {
  ExpectResultError,
  ExpectResultOk,
  NameContinue,
  NameStart,
  TrimStart,
} from "../internal-types";

export type ExpectName<
  S extends string,
  On extends string
> = S extends `${infer A extends NameStart}${infer B}`
  ? Internal<B, A>
  : Ensure<
      { type: "error"; error: "Expected NameStart"; on: On },
      ExpectResultError
    >;

type Internal<
  S extends string,
  R extends string
> = S extends `${infer A extends NameContinue}${infer B}`
  ? Internal<B, `${R}${A}`>
  : Ensure<
      { type: "ok"; value: R; rest: TrimStart<S> },
      ExpectResultOk<string>
    >;

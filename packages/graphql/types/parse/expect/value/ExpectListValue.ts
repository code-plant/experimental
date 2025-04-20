import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../internal-types";
import { ListValue, Value } from "../../types";
import { ExpectValue } from "./ExpectValue";

export type ExpectListValue<
  S extends string,
  On extends string
> = S extends `[${infer I}`
  ? internal<TrimStart<I>, [], On>
  : Ensure<{ type: "error"; error: "Expected ["; on: On }, ExpectResultError>;

type internal<
  S extends string,
  R extends Value[],
  On extends string
> = S extends `]${infer I}`
  ? Ensure<
      { type: "ok"; value: { type: "list"; values: R }; rest: TrimStart<I> },
      ExpectResultOk<ListValue>
    >
  : ExpectValue<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer A extends Value;
      rest: infer B extends string;
    }
    ? internal<B, [...R, A], On>
    : I
  : never;

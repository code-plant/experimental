import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../internal-types";
import { ListValue, Value } from "../../types";
import { ExpectValue } from "./ExpectValue";

export type ExpectListValue<S extends string> = S extends `[${infer I}`
  ? internal<TrimStart<I>, []>
  : Ensure<{ type: "error"; error: "Expected [" }, ExpectResultError>;

type internal<S extends string, R extends Value[]> = S extends `]${infer I}`
  ? Ensure<
      { type: "ok"; value: { type: "list"; values: R }; rest: TrimStart<I> },
      ExpectResultOk<ListValue>
    >
  : ExpectValue<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer A extends Value;
      rest: infer B extends string;
    }
    ? internal<B, [...R, A]>
    : I
  : never;

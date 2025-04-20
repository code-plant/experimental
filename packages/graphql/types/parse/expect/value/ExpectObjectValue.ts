import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../internal-types";
import { Argument, ObjectValue, Value } from "../../types";
import { ExpectName } from "../ExpectName";
import { ExpectValue } from "./ExpectValue";

export type ExpectObjectValue<
  S extends string,
  On extends string
> = S extends `{${infer I}`
  ? Internal<TrimStart<I>, [], On>
  : Ensure<{ type: "error"; error: "Expected {"; on: On }, ExpectResultError>;

type Internal<
  S extends string,
  R extends Argument[],
  On extends string
> = S extends `}${infer I}`
  ? Ensure<
      { type: "ok"; value: { type: "object"; value: R }; rest: TrimStart<I> },
      ExpectResultOk<ObjectValue>
    >
  : ExpectName<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer K extends string;
      rest: infer A extends string;
    }
    ? A extends `:${infer B}`
      ? ExpectValue<TrimStart<B>, On> extends infer I
        ? I extends {
            type: "ok";
            value: infer V extends Value;
            rest: infer C extends string;
          }
          ? Internal<C, [...R, { name: K; value: V }], On>
          : I
        : never
      : Ensure<
          { type: "error"; error: "Expected :"; on: On },
          ExpectResultError
        >
    : I
  : never;

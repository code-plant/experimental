import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../internal-types";
import { Argument, ObjectValue, Value } from "../../types";
import { ExpectName } from "../ExpectName";
import { ExpectValue } from "./ExpectValue";

export type ExpectObjectValue<S extends string> = S extends `{${infer I}`
  ? Internal<TrimStart<I>, []>
  : Ensure<{ type: "error"; error: "Expected [" }, ExpectResultError>;

type Internal<S extends string, R extends Argument[]> = S extends `}${infer I}`
  ? Ensure<
      { type: "ok"; value: { type: "object"; value: R }; rest: TrimStart<I> },
      ExpectResultOk<ObjectValue>
    >
  : ExpectName<S> extends [infer K extends string, infer A extends string]
  ? string extends A
    ? never
    : A extends `:${infer B}`
    ? ExpectValue<TrimStart<B>> extends [
        infer V extends Value,
        infer C extends string
      ]
      ? string extends C
        ? never
        : K extends keyof R
        ? never
        : Internal<C, [...R, { name: K; value: V }]>
      : never
    : never
  : never;

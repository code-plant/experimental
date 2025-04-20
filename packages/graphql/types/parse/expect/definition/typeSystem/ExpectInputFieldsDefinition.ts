import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../internal-types";
import { InputFieldsDefinition, InputValueDefinition } from "../../../types";
import { ExpectInputValueDefinition } from "./ExpectInputValueDefinition";

export type ExpectInputFieldsDefinition<S extends string> =
  S extends `{${infer A}`
    ? ExpectInputValueDefinition<TrimStart<A>> extends infer I
      ? I extends {
          type: "ok";
          value: infer Argument extends InputValueDefinition;
          rest: infer B extends string;
        }
        ? Internal<B, [Argument]>
        : I
      : never
    : Ensure<{ type: "error"; error: "Expected {" }, ExpectResultError>;

type Internal<
  S extends string,
  R extends InputValueDefinition[]
> = S extends `}${infer I}`
  ? Ensure<
      { type: "ok"; value: R; rest: TrimStart<I> },
      ExpectResultOk<InputFieldsDefinition>
    >
  : ExpectInputValueDefinition<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Argument extends InputValueDefinition;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Argument]>
    : I
  : never;

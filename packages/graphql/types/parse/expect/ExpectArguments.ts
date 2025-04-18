import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../internal-types";
import { Argument, Arguments, Value } from "../types";
import { ExpectName } from "./ExpectName";
import { ExpectValue } from "./value/ExpectValue";

export type ExpectArguments<S extends string> =
  S extends `(${infer A extends string}`
    ? ExpectArgument<A> extends infer I
      ? I extends {
          type: "ok";
          value: infer Arg extends Argument;
          rest: infer B extends string;
        }
        ? Internal<B, [Arg]>
        : I
      : never
    : Ensure<{ type: "error"; error: "Expected (" }, ExpectResultError>;

type Internal<S extends string, R extends Argument[]> = S extends `)${infer I}`
  ? Ensure<
      { type: "ok"; value: R; rest: TrimStart<I> },
      ExpectResultOk<Arguments>
    >
  : ExpectArgument<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Arg extends Argument;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Arg]>
    : I
  : never;

type ExpectArgument<S extends string> = ExpectName<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Name extends string;
      rest: infer A extends string;
    }
    ? A extends `:${infer B}`
      ? ExpectValue<TrimStart<B>> extends infer I
        ? I extends {
            type: "ok";
            value: infer V extends Value;
            rest: infer C extends string;
          }
          ? Ensure<
              {
                type: "ok";
                value: { name: Name; value: V };
                rest: TrimStart<C>;
              },
              ExpectResultOk<Argument>
            >
          : I
        : never
      : Ensure<{ type: "error"; error: "Expected :" }, ExpectResultError>
    : I
  : never;

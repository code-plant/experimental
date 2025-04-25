import { Ensure } from "@this-project/util-common-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../internal-types";
import { Argument, Arguments, Value } from "../types";
import { ExpectName } from "./ExpectName";
import { ExpectValue } from "./value/ExpectValue";

export type ExpectArguments<
  S extends string,
  On extends string
> = S extends `(${infer A extends string}`
  ? ExpectArgument<TrimStart<A>, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Arg extends Argument;
        rest: infer B extends string;
      }
      ? Internal<B, [Arg], On>
      : I
    : never
  : Ensure<{ type: "error"; error: "Expected ("; on: On }, ExpectResultError>;

type Internal<
  S extends string,
  R extends Argument[],
  On extends string
> = S extends `)${infer I}`
  ? Ensure<
      { type: "ok"; value: R; rest: TrimStart<I> },
      ExpectResultOk<Arguments>
    >
  : ExpectArgument<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer Arg extends Argument;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Arg], On>
    : I
  : never;

type ExpectArgument<S extends string, On extends string> = ExpectName<
  S,
  On
> extends infer I
  ? I extends {
      type: "ok";
      value: infer Name extends string;
      rest: infer A extends string;
    }
    ? A extends `:${infer B}`
      ? ExpectValue<TrimStart<B>, `${On} - argument ${Name}`> extends infer I
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
      : Ensure<
          { type: "error"; error: "Expected :"; on: On },
          ExpectResultError
        >
    : I
  : never;

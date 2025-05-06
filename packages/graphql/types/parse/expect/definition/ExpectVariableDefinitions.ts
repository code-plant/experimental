import { Ensure } from "@this-project/util-types-common";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../internal-types";
import {
  Directive,
  Type,
  Value,
  VariableDefinition,
  VariableDefinitions,
} from "../../types";
import { ExpectDirectives } from "../ExpectDirectives";
import { ExpectName } from "../ExpectName";
import { ExpectType } from "../ExpectType";
import { ExpectValue } from "../value/ExpectValue";

export type ExpectVariableDefinitions<
  S extends string,
  On extends string
> = S extends `(${infer A extends string}`
  ? ExpectVariableDefinition<A, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Argument extends VariableDefinition;
        rest: infer B extends string;
      }
      ? Internal<B, [Argument], On>
      : I
    : never
  : Ensure<{ type: "error"; error: "Expected ("; on: On }, ExpectResultError>;

type Internal<
  S extends string,
  R extends VariableDefinition[],
  On extends string
> = S extends `)${infer I}`
  ? Ensure<
      { type: "ok"; value: R; rest: TrimStart<I> },
      ExpectResultOk<VariableDefinitions>
    >
  : ExpectVariableDefinition<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer Argument extends VariableDefinition;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Argument], On>
    : I
  : never;

type ExpectVariableDefinition<
  S extends string,
  On extends string
> = S extends `$${infer A}`
  ? ExpectName<TrimStart<A>, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? B extends `:${infer C}`
        ? ExpectType<TrimStart<C>, `${On} - type of ${Name}`> extends infer I
          ? I extends {
              type: "ok";
              value: infer T extends Type;
              rest: infer D extends string;
            }
            ? D extends `=${infer E}`
              ? ExpectValue<
                  TrimStart<E>,
                  `${On} - default value of ${Name}`
                > extends infer I
                ? I extends {
                    type: "ok";
                    value: infer DefaultValue extends Value;
                    rest: infer F extends string;
                  }
                  ? AfterDefaultValue<F, Name, T, DefaultValue, On>
                  : I
                : never
              : AfterDefaultValue<D, Name, T, undefined, On>
            : I
          : never
        : Ensure<
            { type: "error"; error: "Expected :"; on: `${On} - ${Name}` },
            ExpectResultError
          >
      : I
    : never
  : Ensure<{ type: "error"; error: "Expected $"; on: On }, ExpectResultError>;

type AfterDefaultValue<
  S extends string,
  Name extends string,
  T extends Type,
  DefaultValue extends Value | undefined,
  On extends string
> = ExpectDirectives<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer Directives extends Directive[];
      rest: infer A extends string;
    }
    ? Ensure<
        {
          type: "ok";
          value: {
            name: Name;
            type: T;
            defaultValue: DefaultValue;
            directives: Directives;
          };
          rest: A;
        },
        ExpectResultOk<VariableDefinition>
      >
    : I
  : never;

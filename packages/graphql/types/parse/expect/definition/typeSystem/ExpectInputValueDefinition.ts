import { Ensure } from "@this-project/util-common-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../internal-types";
import { Directive, InputValueDefinition, Type, Value } from "../../../types";
import { ExpectDirectives } from "../../ExpectDirectives";
import { ExpectName } from "../../ExpectName";
import { ExpectString } from "../../ExpectString";
import { ExpectType } from "../../ExpectType";
import { ExpectValue } from "../../value/ExpectValue";

export type ExpectInputValueDefinition<
  S extends string,
  On extends string
> = S extends `"${string}`
  ? ExpectString<S, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Description extends string;
        rest: infer A extends string;
      }
      ? AfterDescription<A, Description, On>
      : I
    : never
  : AfterDescription<S, undefined, On>;

type AfterDescription<
  S extends string,
  Description extends string | undefined,
  On extends string
> = ExpectName<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer Name extends string;
      rest: infer A extends string;
    }
    ? A extends `:${infer B}`
      ? ExpectType<TrimStart<B>, `${On} - type of ${Name}`> extends infer I
        ? I extends {
            type: "ok";
            value: infer T extends Type;
            rest: infer C extends string;
          }
          ? C extends `=${infer D}`
            ? ExpectValue<
                TrimStart<D>,
                `${On} - default value of ${Name}`
              > extends infer I
              ? I extends {
                  type: "ok";
                  value: infer DefaultValue extends Value;
                  rest: infer E extends string;
                }
                ? AfterDefaultValue<E, Description, Name, T, DefaultValue, On>
                : I
              : never
            : AfterDefaultValue<C, Description, Name, T, undefined, On>
          : I
        : never
      : Ensure<
          {
            type: "error";
            error: "Expected :";
            on: `${On} - after name ${Name}`;
          },
          ExpectResultError
        >
    : I
  : never;

type AfterDefaultValue<
  S extends string,
  Description extends string | undefined,
  Name extends string,
  T extends Type,
  DefaultValue extends Value | undefined,
  On extends string
> = ExpectDirectives<S, `${On} - directive of ${Name}`> extends infer I
  ? I extends {
      type: "ok";
      value: infer Directives extends Directive[];
      rest: infer A extends string;
    }
    ? Ensure<
        {
          type: "ok";
          value: {
            description: Description;
            name: Name;
            type: T;
            defaultValue: DefaultValue;
            directives: Directives;
          };
          rest: A;
        },
        ExpectResultOk<InputValueDefinition>
      >
    : I
  : never;

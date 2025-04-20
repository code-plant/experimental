import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../../internal-types";
import {
  Directives,
  EnumTypeDefinition,
  EnumValueDefinition,
  EnumValuesDefinition,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";
import { ExpectString } from "../../../ExpectString";

export type ExpectEnumTypeDefinition<
  S extends string,
  Description extends string | undefined
> = ExpectName<S> extends {
  type: "ok";
  value: "enum";
  rest: infer A extends string;
}
  ? ExpectName<A> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? ExpectDirectives<B> extends infer I
        ? I extends {
            type: "ok";
            value: infer Dir extends Directives;
            rest: infer C extends string;
          }
          ? C extends `{${string}`
            ? ExpectEnumValuesDefinition<C> extends infer I
              ? I extends {
                  type: "ok";
                  value: infer Values extends EnumValuesDefinition;
                  rest: infer D extends string;
                }
                ? Ensure<
                    {
                      type: "ok";
                      value: {
                        type: "typeSystem";
                        subType: "definition";
                        definitionType: "type";
                        typeType: "enum";
                        description: Description;
                        name: Name;
                        directives: Dir;
                        enumValuesDefinition: Values;
                      };
                      rest: D;
                    },
                    ExpectResultOk<EnumTypeDefinition>
                  >
                : I
              : never
            : Ensure<
                {
                  type: "ok";
                  value: {
                    type: "typeSystem";
                    subType: "definition";
                    definitionType: "type";
                    typeType: "enum";
                    description: Description;
                    name: Name;
                    directives: Dir;
                    enumValuesDefinition: [];
                  };
                  rest: C;
                },
                ExpectResultOk<EnumTypeDefinition>
              >
          : I
        : never
      : I
    : never
  : Ensure<
      { type: "error"; error: "Expected keyword enum" },
      ExpectResultError
    >;

type ExpectEnumValuesDefinition<S extends string> = S extends `{${infer A}`
  ? ExpectEnumValueDefinition<TrimStart<A>> extends infer I
    ? I extends {
        type: "ok";
        value: infer Value extends EnumValueDefinition;
        rest: infer B extends string;
      }
      ? Internal<B, [Value]>
      : I
    : never
  : Ensure<{ type: "error"; error: "Expected {" }, ExpectResultError>;

type Internal<
  S extends string,
  R extends EnumValuesDefinition
> = S extends `}${infer I}`
  ? Ensure<
      { type: "ok"; value: R; rest: TrimStart<I> },
      ExpectResultOk<EnumValuesDefinition>
    >
  : ExpectEnumValueDefinition<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Value extends EnumValueDefinition;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Value]>
    : I
  : never;

type ExpectEnumValueDefinition<S extends string> = S extends `"${string}`
  ? ExpectString<S> extends infer I
    ? I extends {
        type: "ok";
        value: infer Description extends string;
        rest: infer A extends string;
      }
      ? AfterDescription<A, Description>
      : I
    : never
  : AfterDescription<S, undefined>;

type AfterDescription<
  S extends string,
  Description extends string | undefined
> = ExpectName<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Name extends string;
      rest: infer A extends string;
    }
    ? Name extends "true" | "false" | "null"
      ? Ensure<
          { type: "error"; error: "Invalid enum value" },
          ExpectResultError
        >
      : ExpectDirectives<A> extends infer I
      ? I extends {
          type: "ok";
          value: infer Dir extends Directives;
          rest: infer B extends string;
        }
        ? Ensure<
            {
              type: "ok";
              value: {
                description: Description;
                enumValue: Name;
                directives: Dir;
              };
              rest: B;
            },
            ExpectResultOk<EnumValueDefinition>
          >
        : I
      : never
    : I
  : never;

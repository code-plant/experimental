import { Directives } from "../../../types";

import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError, ExpectResultOk } from "../../../internal-types";

import { TrimStart } from "../../../internal-types";
import { EnumValueDefinition, EnumValuesDefinition } from "../../../types";
import { ExpectDirectives } from "../../ExpectDirectives";
import { ExpectName } from "../../ExpectName";
import { ExpectString } from "../../ExpectString";

export type ExpectEnumValuesDefinition<
  S extends string,
  On extends string
> = S extends `{${infer A}`
  ? ExpectEnumValueDefinition<TrimStart<A>, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Value extends EnumValueDefinition;
        rest: infer B extends string;
      }
      ? Internal<B, [Value], On>
      : I
    : never
  : Ensure<{ type: "error"; error: "Expected {"; on: On }, ExpectResultError>;

type Internal<
  S extends string,
  R extends EnumValuesDefinition,
  On extends string
> = S extends `}${infer I}`
  ? Ensure<
      { type: "ok"; value: R; rest: TrimStart<I> },
      ExpectResultOk<EnumValuesDefinition>
    >
  : ExpectEnumValueDefinition<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer Value extends EnumValueDefinition;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Value], On>
    : I
  : never;

type ExpectEnumValueDefinition<
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
    ? Name extends "true" | "false" | "null"
      ? Ensure<
          { type: "error"; error: "Invalid enum value"; on: On },
          ExpectResultError
        >
      : ExpectDirectives<A, `${On} - directives of ${Name}`> extends infer I
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

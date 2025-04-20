import { Directives } from "../../../types";

import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError, ExpectResultOk } from "../../../internal-types";

import { TrimStart } from "../../../internal-types";
import { EnumValueDefinition, EnumValuesDefinition } from "../../../types";
import { ExpectDirectives } from "../../ExpectDirectives";
import { ExpectName } from "../../ExpectName";
import { ExpectString } from "../../ExpectString";

export type ExpectEnumValuesDefinition<S extends string> =
  S extends `{${infer A}`
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

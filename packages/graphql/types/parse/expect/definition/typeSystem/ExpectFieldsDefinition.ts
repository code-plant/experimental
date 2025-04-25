import { Ensure } from "@this-project/util-common-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../internal-types";
import {
  ArgumentsDefinition,
  Directives,
  FieldDefinition,
  FieldsDefinition,
  Type,
} from "../../../types";
import { ExpectDirectives } from "../../ExpectDirectives";
import { ExpectName } from "../../ExpectName";
import { ExpectString } from "../../ExpectString";
import { ExpectType } from "../../ExpectType";
import { ExpectArgumentsDefinition } from "./ExpectArgumentsDefinition";

export type ExpectFieldsDefinition<
  S extends string,
  On extends string
> = S extends `{${infer A}`
  ? ExpectFieldDefinition<TrimStart<A>, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Field extends FieldDefinition;
        rest: infer B extends string;
      }
      ? Internal<B, [Field], On>
      : Ensure<
          {
            type: "error";
            error: "Expected FieldDefinition";
            on: On;
          },
          ExpectResultError
        >
    : never
  : Ensure<
      {
        type: "error";
        error: "Expected {";
        on: On;
      },
      ExpectResultError
    >;

type Internal<
  S extends string,
  R extends FieldDefinition[],
  On extends string
> = S extends `}${infer A}`
  ? Ensure<
      {
        type: "ok";
        value: R;
        rest: TrimStart<A>;
      },
      ExpectResultOk<FieldsDefinition>
    >
  : ExpectFieldDefinition<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer Field extends FieldDefinition;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Field], On>
    : I
  : never;

type ExpectFieldDefinition<
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
    ? A extends `(${string}`
      ? ExpectArgumentsDefinition<
          A,
          `${On} - arguments of ${Name}`
        > extends infer I
        ? I extends {
            type: "ok";
            value: infer Arguments extends ArgumentsDefinition;
            rest: infer B extends string;
          }
          ? AfterArguments<B, Description, Name, Arguments, On>
          : I
        : never
      : AfterArguments<A, Description, Name, [], On>
    : I
  : never;

type AfterArguments<
  S extends string,
  Description extends string | undefined,
  Name extends string,
  Arguments extends ArgumentsDefinition,
  On extends string
> = S extends `:${infer A}`
  ? ExpectType<TrimStart<A>, `${On} - type of ${Name}`> extends infer I
    ? I extends {
        type: "ok";
        value: infer T extends Type;
        rest: infer B extends string;
      }
      ? ExpectDirectives<B, `${On} - directives of ${Name}`> extends infer I
        ? I extends {
            type: "ok";
            value: infer Dir extends Directives;
            rest: infer C extends string;
          }
          ? Ensure<
              {
                type: "ok";
                value: {
                  description: Description;
                  name: Name;
                  argumentsDefinition: Arguments;
                  type: T;
                  directives: Dir;
                };
                rest: C;
              },
              ExpectResultOk<FieldDefinition>
            >
          : I
        : never
      : I
    : never
  : Ensure<
      { type: "error"; error: "Expected :"; on: `${On} - for ${Name}` },
      ExpectResultError
    >;

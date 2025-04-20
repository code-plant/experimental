import { Ensure } from "@this-project/common-util-types";
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
import { ExpectArgumentsDefinition } from "./definition/ExpectArgumentsDefinition";

export type ExpectFieldsDefinition<S extends string> = S extends `{${infer A}`
  ? ExpectFieldDefinition<TrimStart<A>> extends infer I
    ? I extends {
        type: "ok";
        value: infer Field extends FieldDefinition;
        rest: infer B extends string;
      }
      ? Internal<B, [Field]>
      : Ensure<
          {
            type: "error";
            error: "Expected FieldDefinition";
          },
          ExpectResultError
        >
    : never
  : Ensure<
      {
        type: "error";
        error: "Expected {";
      },
      ExpectResultError
    >;

type Internal<
  S extends string,
  R extends FieldDefinition[]
> = S extends `}${infer A}`
  ? Ensure<
      {
        type: "ok";
        value: R;
        rest: TrimStart<A>;
      },
      ExpectResultOk<FieldsDefinition>
    >
  : ExpectFieldDefinition<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Field extends FieldDefinition;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Field]>
    : I
  : never;

type ExpectFieldDefinition<S extends string> = S extends `"${string}`
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
    ? A extends `(${string}`
      ? ExpectArgumentsDefinition<A> extends infer I
        ? I extends {
            type: "ok";
            value: infer Arguments extends ArgumentsDefinition;
            rest: infer B extends string;
          }
          ? AfterArguments<B, Description, Name, Arguments>
          : I
        : never
      : AfterArguments<A, Description, Name, []>
    : I
  : never;

type AfterArguments<
  S extends string,
  Description extends string | undefined,
  Name extends string,
  Arguments extends ArgumentsDefinition
> = S extends `:${infer A}`
  ? ExpectType<TrimStart<A>> extends infer I
    ? I extends {
        type: "ok";
        value: infer T extends Type;
        rest: infer B extends string;
      }
      ? ExpectDirectives<B> extends infer I
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
  : Ensure<{ type: "error"; error: "Expected :" }, ExpectResultError>;

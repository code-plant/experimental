import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError, ExpectResultOk } from "../../../../internal-types";
import {
  Directives,
  EnumTypeExtension,
  EnumValuesDefinition,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";
import { ExpectEnumValuesDefinition } from "../ExpectEnumValuesDefinition";

export type ExpectEnumTypeExtensionAfterEnum<S extends string> =
  ExpectName<S> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer A extends string;
      }
      ? ExpectDirectives<A> extends infer I
        ? I extends {
            type: "ok";
            value: infer Dir extends Directives;
            rest: infer B extends string;
          }
          ? B extends `{${string}`
            ? ExpectEnumValuesDefinition<B> extends infer I
              ? I extends {
                  type: "ok";
                  value: infer Values extends EnumValuesDefinition;
                  rest: infer C extends string;
                }
                ? Validate<C, Name, Dir, Values>
                : I
              : never
            : Validate<B, Name, Dir, []>
          : I
        : never
      : I
    : never;

type Validate<
  S extends string,
  Name extends string,
  Dir extends Directives,
  Values extends EnumValuesDefinition
> = IsValid<Dir, Values> extends true
  ? Ensure<
      {
        type: "ok";
        value: {
          type: "typeSystem";
          subType: "extension";
          extensionType: "type";
          typeType: "enum";
          name: Name;
          directives: Dir;
          enumValuesDefinition: Values;
        };
        rest: S;
      },
      ExpectResultOk<EnumTypeExtension>
    >
  : Ensure<
      { type: "error"; error: "Expected Directives or EnumValuesDefinition" },
      ExpectResultError
    >;

type IsValid<
  Dir extends Directives,
  Values extends EnumValuesDefinition
> = Dir["length"] extends 0
  ? Values["length"] extends 0
    ? false
    : true
  : true;

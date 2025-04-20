import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError, ExpectResultOk } from "../../../../internal-types";
import {
  Directives,
  InputFieldsDefinition,
  InputObjectTypeExtension,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";
import { ExpectInputFieldsDefinition } from "../ExpectInputFieldsDefinition";

export type ExpectInputObjectTypeExtensionAfterInput<S extends string> =
  ExpectName<S, "top level - input object type extension"> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer A extends string;
      }
      ? ExpectDirectives<A, `${Name} extension - directives`> extends infer I
        ? I extends {
            type: "ok";
            value: infer Dir extends Directives;
            rest: infer B extends string;
          }
          ? B extends `{${string}`
            ? ExpectInputFieldsDefinition<
                B,
                `${Name} extension - fields`
              > extends infer I
              ? I extends {
                  type: "ok";
                  value: infer Fields extends InputFieldsDefinition;
                  rest: infer C extends string;
                }
                ? Validate<C, Name, Dir, Fields>
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
  Fields extends InputFieldsDefinition
> = IsValid<Dir, Fields> extends true
  ? Ensure<
      {
        type: "ok";
        value: {
          type: "typeSystem";
          subType: "extension";
          extensionType: "type";
          typeType: "inputObject";
          name: Name;
          directives: Dir;
          inputFieldsDefinition: Fields;
        };
        rest: S;
      },
      ExpectResultOk<InputObjectTypeExtension>
    >
  : Ensure<
      {
        type: "error";
        error: "Expected Directives or InputFieldsDefinition";
        on: `${Name} extension`;
      },
      ExpectResultError
    >;

type IsValid<
  Dir extends Directives,
  Fields extends InputFieldsDefinition
> = Dir["length"] extends 0
  ? Fields["length"] extends 0
    ? false
    : true
  : true;

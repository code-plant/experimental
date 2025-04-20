import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../../internal-types";
import {
  Directives,
  FieldsDefinition,
  InterfaceTypeExtension,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";
import { ExpectFieldsDefinition } from "../ExpectFieldsDefinition";

export type ExpectInterfaceTypeExtensionAfterInterface<S extends string> =
  ExpectName<S, "top level - interface type extension"> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer A extends string;
      }
      ? ExpectName<A, `${Name} extension`> extends {
          type: "ok";
          value: "implements";
          rest: infer B extends string;
        }
        ? B extends `&${infer C}`
          ? ExpectImplementsInterfaces<TrimStart<C>, [], Name> extends infer I
            ? I extends {
                type: "ok";
                value: infer ImplementsInterfaces extends string[];
                rest: infer D extends string;
              }
              ? AfterImplementsInterfaces<D, Name, ImplementsInterfaces>
              : I
            : never
          : ExpectName<B, `${Name} extension - implements`> extends infer I
          ? I extends {
              type: "ok";
              value: infer ImplementsInterface extends string;
              rest: infer D extends string;
            }
            ? ExpectImplementsInterfaces<
                D,
                [ImplementsInterface],
                Name
              > extends infer I
              ? I extends {
                  type: "ok";
                  value: infer ImplementsInterfaces extends string[];
                  rest: infer E extends string;
                }
                ? AfterImplementsInterfaces<E, Name, ImplementsInterfaces>
                : I
              : never
            : I
          : never
        : AfterImplementsInterfaces<A, Name, []>
      : I
    : never;

type ExpectImplementsInterfaces<
  S extends string,
  R extends string[],
  Name extends string
> = S extends `&${infer A}`
  ? ExpectName<TrimStart<A>, `${Name} extension - implements`> extends infer I
    ? I extends {
        type: "ok";
        value: infer ImplementsInterface extends string;
        rest: infer B extends string;
      }
      ? ExpectImplementsInterfaces<B, [...R, ImplementsInterface], Name>
      : I
    : never
  : Ensure<{ type: "ok"; value: R; rest: S }, ExpectResultOk<string[]>>;

type AfterImplementsInterfaces<
  S extends string,
  Name extends string,
  ImplementsInterfaces extends string[]
> = ExpectDirectives<S, `${Name} extension - directives`> extends infer I
  ? I extends {
      type: "ok";
      value: infer Dir extends Directives;
      rest: infer A extends string;
    }
    ? A extends `{${string}`
      ? ExpectFieldsDefinition<A, `${Name} extension - fields`> extends infer I
        ? I extends {
            type: "ok";
            value: infer Fields extends FieldsDefinition;
            rest: infer B extends string;
          }
          ? Validate<B, Name, ImplementsInterfaces, Dir, Fields>
          : I
        : never
      : Validate<A, Name, ImplementsInterfaces, Dir, []>
    : I
  : never;

type Validate<
  S extends string,
  Name extends string,
  ImplementsInterfaces extends string[],
  Dir extends Directives,
  Fields extends FieldsDefinition
> = IsValid<ImplementsInterfaces, Dir, Fields> extends true
  ? Ensure<
      {
        type: "ok";
        value: {
          type: "typeSystem";
          subType: "extension";
          extensionType: "type";
          typeType: "interface";
          name: Name;
          implementsInterfaces: ImplementsInterfaces;
          directives: Dir;
          fieldsDefinition: Fields;
        };
        rest: S;
      },
      ExpectResultOk<InterfaceTypeExtension>
    >
  : Ensure<
      {
        type: "error";
        error: "Expect ImplementsInterfaces or Directives or FieldsDefinition";
        on: `${Name} extension`;
      },
      ExpectResultError
    >;

type IsValid<
  ImplementsInterfaces extends string[],
  Dir extends Directives,
  Fields extends FieldsDefinition
> = ImplementsInterfaces["length"] extends 0
  ? Dir["length"] extends 0
    ? Fields["length"] extends 0
      ? false
      : true
    : true
  : true;

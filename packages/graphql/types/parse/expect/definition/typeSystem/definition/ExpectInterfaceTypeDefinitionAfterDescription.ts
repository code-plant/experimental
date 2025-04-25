import { Ensure } from "@this-project/util-common-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../../internal-types";
import {
  Directive,
  FieldsDefinition,
  InterfaceTypeDefinition,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";
import { ExpectFieldsDefinition } from "../ExpectFieldsDefinition";

export type ExpectInterfaceTypeDefinitionAfterDescription<
  S extends string,
  Description extends string | undefined
> = ExpectName<S, "top level - interface type definition"> extends {
  type: "ok";
  value: "interface";
  rest: infer A extends string;
}
  ? ExpectName<A, "top level - interface type definition"> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? ExpectName<B, `${Name} definition`> extends {
          type: "ok";
          value: "implements";
          rest: infer C extends string;
        }
        ? C extends `&${infer D}`
          ? ExpectImplementsInterfaces<TrimStart<D>, [], Name> extends infer I
            ? I extends {
                type: "ok";
                value: infer ImplementsInterfaces extends string[];
                rest: infer E extends string;
              }
              ? AfterImplementsInterfaces<
                  E,
                  Description,
                  Name,
                  ImplementsInterfaces
                >
              : I
            : never
          : ExpectName<C, `${Name} definition - implements`> extends infer I
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
                ? AfterImplementsInterfaces<
                    E,
                    Description,
                    Name,
                    ImplementsInterfaces
                  >
                : I
              : never
            : I
          : never
        : AfterImplementsInterfaces<B, Description, Name, []>
      : I
    : never
  : Ensure<
      {
        type: "error";
        error: "Expected keyword interface";
        on: "top level - interface type definition";
      },
      ExpectResultError
    >;

type ExpectImplementsInterfaces<
  S extends string,
  R extends string[],
  Name extends string
> = S extends `&${infer A}`
  ? ExpectName<TrimStart<A>, `${Name} definition - implements`> extends infer I
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
  Description extends string | undefined,
  Name extends string,
  ImplementsInterfaces extends string[]
> = ExpectDirectives<S, `${Name} definition - directives`> extends infer I
  ? I extends {
      type: "ok";
      value: infer Directives extends Directive[];
      rest: infer A extends string;
    }
    ? A extends `{${string}`
      ? ExpectFieldsDefinition<A, `${Name} definition - fields`> extends infer I
        ? I extends {
            type: "ok";
            value: infer Fields extends FieldsDefinition;
            rest: infer B extends string;
          }
          ? Ensure<
              {
                type: "ok";
                value: {
                  type: "typeSystem";
                  subType: "definition";
                  definitionType: "type";
                  typeType: "interface";
                  description: Description;
                  name: Name;
                  implementsInterfaces: ImplementsInterfaces;
                  directives: Directives;
                  fieldsDefinition: Fields;
                };
                rest: B;
              },
              ExpectResultOk<InterfaceTypeDefinition>
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
              typeType: "interface";
              description: Description;
              name: Name;
              implementsInterfaces: ImplementsInterfaces;
              directives: Directives;
              fieldsDefinition: [];
            };
            rest: A;
          },
          ExpectResultOk<InterfaceTypeDefinition>
        >
    : I
  : never;

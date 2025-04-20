import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError, ExpectResultOk } from "../../../../internal-types";
import {
  Directives,
  EnumTypeDefinition,
  EnumValuesDefinition,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";
import { ExpectEnumValuesDefinition } from "../ExpectEnumValuesDefinition";

export type ExpectEnumTypeDefinitionAfterDescription<
  S extends string,
  Description extends string | undefined
> = ExpectName<S, "top level - enum type definition"> extends {
  type: "ok";
  value: "enum";
  rest: infer A extends string;
}
  ? ExpectName<A, "top level - enum type definition"> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? ExpectDirectives<B, `${Name} definition - directives`> extends infer I
        ? I extends {
            type: "ok";
            value: infer Dir extends Directives;
            rest: infer C extends string;
          }
          ? C extends `{${string}`
            ? ExpectEnumValuesDefinition<
                C,
                `${Name} definition - enum values`
              > extends infer I
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
      {
        type: "error";
        error: "Expected keyword enum";
        on: "top level - enum type definition";
      },
      ExpectResultError
    >;

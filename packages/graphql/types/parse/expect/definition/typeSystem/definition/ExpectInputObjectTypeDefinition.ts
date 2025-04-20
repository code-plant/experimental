import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError, ExpectResultOk } from "../../../../internal-types";
import {
  Directives,
  InputFieldsDefinition,
  InputObjectTypeDefinition,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";
import { ExpectInputFieldsDefinition } from "../ExpectINputFieldsDefinition";

export type ExpectInputObjectTypeDefinition<
  S extends string,
  Description extends string | undefined
> = ExpectName<S> extends {
  type: "ok";
  value: "input";
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
            ? ExpectInputFieldsDefinition<C> extends infer I
              ? I extends {
                  type: "ok";
                  value: infer Fields extends InputFieldsDefinition;
                  rest: infer D extends string;
                }
                ? Ensure<
                    {
                      type: "ok";
                      value: {
                        type: "typeSystem";
                        subType: "definition";
                        definitionType: "type";
                        typeType: "inputObject";
                        description: Description;
                        name: Name;
                        directives: Dir;
                        inputFieldsDefinition: Fields;
                      };
                      rest: D;
                    },
                    ExpectResultOk<InputObjectTypeDefinition>
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
                    typeType: "inputObject";
                    description: Description;
                    name: Name;
                    directives: Dir;
                    inputFieldsDefinition: [];
                  };
                  rest: C;
                },
                ExpectResultOk<InputObjectTypeDefinition>
              >
          : I
        : never
      : I
    : never
  : Ensure<
      { type: "error"; error: "Expected keyword input" },
      ExpectResultError
    >;

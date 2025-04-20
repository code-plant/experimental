import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError, ExpectResultOk } from "../../../../internal-types";
import { Directive, ScalarTypeDefinition } from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";

export type ExpectScalarTypeDefinition<
  S extends string,
  Description extends string | undefined
> = ExpectName<S> extends {
  type: "ok";
  value: "scalar";
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
            value: infer Directives extends Directive[];
            rest: infer C extends string;
          }
          ? Ensure<
              {
                type: "ok";
                value: {
                  type: "typeSystem";
                  subType: "definition";
                  definitionType: "type";
                  typeType: "scalar";
                  description: Description;
                  name: Name;
                  directives: Directives;
                };
                rest: C;
              },
              ExpectResultOk<ScalarTypeDefinition>
            >
          : I
        : never
      : I
    : never
  : Ensure<
      { type: "error"; error: "Expected keyword scalar" },
      ExpectResultError
    >;

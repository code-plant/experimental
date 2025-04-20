import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../../internal-types";
import {
  Directive,
  RootOperationTypeDefinition,
  SchemaDefinition,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";
import { ExpectRootOperationTypesDefinition } from "../ExpectRootOperationTypesDefinition";

export type ExpectSchemaDefinitionAfterDescription<
  S extends string,
  Description extends string | undefined
> = ExpectName<S> extends {
  type: "ok";
  value: "schema";
  rest: infer A extends string;
}
  ? ExpectDirectives<A> extends infer I
    ? I extends {
        type: "ok";
        value: infer Directives extends Directive[];
        rest: infer B extends string;
      }
      ? B extends `{${string}`
        ? ExpectRootOperationTypesDefinition<TrimStart<B>> extends infer I
          ? I extends {
              type: "ok";
              value: infer RootOperationTypeDefinitions extends RootOperationTypeDefinition[];
              rest: infer A extends string;
            }
            ? Ensure<
                {
                  type: "ok";
                  value: {
                    type: "typeSystem";
                    subType: "definition";
                    definitionType: "schema";
                    description: Description;
                    directives: Directives;
                    rootOperationTypeDefinitions: RootOperationTypeDefinitions;
                  };
                  rest: A;
                },
                ExpectResultOk<SchemaDefinition>
              >
            : I
          : never
        : Ensure<{ type: "error"; error: "Expected {" }, ExpectResultError>
      : I
    : never
  : Ensure<
      { type: "error"; error: "Expected keyword schema" },
      ExpectResultError
    >;

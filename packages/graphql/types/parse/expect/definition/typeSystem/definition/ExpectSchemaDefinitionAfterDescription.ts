import { Ensure } from "@this-project/util-types-common";
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
> = ExpectName<S, "top level - schema definition"> extends {
  type: "ok";
  value: "schema";
  rest: infer A extends string;
}
  ? ExpectDirectives<A, `schema definition - directives`> extends infer I
    ? I extends {
        type: "ok";
        value: infer Directives extends Directive[];
        rest: infer B extends string;
      }
      ? B extends `{${string}`
        ? ExpectRootOperationTypesDefinition<
            TrimStart<B>,
            `schema definition - root operation types`
          > extends infer I
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
        : Ensure<
            {
              type: "error";
              error: "Expected {";
              on: "schema definition - root operation types";
            },
            ExpectResultError
          >
      : I
    : never
  : Ensure<
      {
        type: "error";
        error: "Expected keyword schema";
        on: "top level - schema definition";
      },
      ExpectResultError
    >;

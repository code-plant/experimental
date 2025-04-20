import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../../internal-types";
import {
  Directive,
  OperationType,
  RootOperationTypeDefinition,
  SchemaDefinition,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";

export type ExpectSchemaDefinition<
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
      ? B extends `{${infer C}`
        ? Internal<TrimStart<C>, Description, Directives, []>
        : Ensure<{ type: "error"; error: "Expected {" }, ExpectResultError>
      : I
    : never
  : Ensure<
      { type: "error"; error: "Expected keyword schema" },
      ExpectResultError
    >;

type Internal<
  S extends string,
  Description extends string | undefined,
  Directives extends Directive[],
  RootOperationTypeDefinitions extends RootOperationTypeDefinition[]
> = S extends `}${infer I}`
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
        rest: TrimStart<I>;
      },
      ExpectResultOk<SchemaDefinition>
    >
  : ExpectName<S> extends {
      type: "ok";
      value: infer OT extends OperationType;
      rest: infer A extends string;
    }
  ? A extends `:${infer B}`
    ? ExpectName<TrimStart<B>> extends infer I
      ? I extends {
          type: "ok";
          value: infer Name extends string;
          rest: infer A extends string;
        }
        ? Internal<
            A,
            Description,
            Directives,
            [...RootOperationTypeDefinitions, { operationType: OT; type: Name }]
          >
        : I
      : never
    : Ensure<{ type: "error"; error: "Expected :" }, ExpectResultError>
  : Ensure<
      { type: "error"; error: "Expected OperationType" },
      ExpectResultError
    >;

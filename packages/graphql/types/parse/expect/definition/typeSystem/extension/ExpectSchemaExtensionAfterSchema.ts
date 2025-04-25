import { Ensure } from "@this-project/util-common-types";
import { ExpectResultError, ExpectResultOk } from "../../../../internal-types";
import {
  Directives,
  RootOperationTypeDefinition,
  SchemaExtension,
} from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectRootOperationTypesDefinition } from "../ExpectRootOperationTypesDefinition";

export type ExpectSchemaExtensionAfterSchema<S extends string> =
  ExpectDirectives<S, "schema extension - directives"> extends infer I
    ? I extends {
        type: "ok";
        value: infer Dir extends Directives;
        rest: infer A extends string;
      }
      ? A extends `{${string}`
        ? ExpectRootOperationTypesDefinition<
            A,
            "schema extension - root operation types"
          > extends infer I
          ? I extends {
              type: "ok";
              value: infer RootOperationTypesDefinition extends RootOperationTypeDefinition[];
              rest: infer B extends string;
            }
            ? Validate<B, Dir, RootOperationTypesDefinition>
            : I
          : never
        : Validate<A, Dir, []>
      : I
    : never;

type Validate<
  S extends string,
  Dir extends Directives,
  RootOperationTypesDefinition extends RootOperationTypeDefinition[]
> = IsValid<Dir, RootOperationTypesDefinition> extends true
  ? Ensure<
      {
        type: "ok";
        value: {
          type: "typeSystem";
          subType: "extension";
          extensionType: "schema";
          directives: Dir;
          rootOperationTypeDefinitions: RootOperationTypesDefinition;
        };
        rest: S;
      },
      ExpectResultOk<SchemaExtension>
    >
  : Ensure<
      {
        type: "error";
        error: "Expected directives or root operation types";
        on: "schema extension";
      },
      ExpectResultError
    >;

type IsValid<
  Dir extends Directives,
  RootOperationTypesDefinition extends RootOperationTypeDefinition[]
> = Dir["length"] extends 0
  ? RootOperationTypesDefinition["length"] extends 0
    ? false
    : true
  : true;

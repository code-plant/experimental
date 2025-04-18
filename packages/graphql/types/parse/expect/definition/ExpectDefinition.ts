import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError } from "../../internal-types";
import { ExpectName } from "../ExpectName";
import { ExpectOperationDefinition } from "./executable/ExpectOperationDefinition";

export type ExpectDefinition<S extends string> = S extends `{${string}`
  ? ExpectOperationDefinition<S>
  : ExpectName<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Keyword extends string;
    }
    ? Keyword extends "query" | "mutation" | "subscription"
      ? ExpectOperationDefinition<S>
      : Keyword extends "fragment"
      ? ExpectFragmentDefinition<S>
      : Keyword extends "schema"
      ? ExpectSchemaDefinition<S>
      : Keyword extends "directive"
      ? ExpectDirectiveDefinition<S>
      : Keyword extends "scalar"
      ? ExpectScalarTypeDefinition<S>
      : Keyword extends "type"
      ? ExpectTypeDefinition<S>
      : Keyword extends "interface"
      ? ExpectInterfaceTypeDefinition<S>
      : Keyword extends "union"
      ? ExpectUnionTypeDefinition<S>
      : Keyword extends "input"
      ? ExpectInputObjectTypeDefinition<S>
      : Keyword extends "enum"
      ? ExpectEnumTypeDefinition<S>
      : Keyword extends "extend"
      ? ExpectTypeSystemExtensionDefinition<S>
      : Ensure<{ type: "error"; error: "Expected keyword" }, ExpectResultError>
    : Ensure<{ type: "error"; error: "Expected { or Name" }, ExpectResultError>
  : never;

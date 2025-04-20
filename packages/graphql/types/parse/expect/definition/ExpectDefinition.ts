import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError } from "../../internal-types";
import { ExpectName } from "../ExpectName";
import { ExpectFragmentDefinition } from "./executable/ExpectFragmentDefinition";
import { ExpectOperationDefinition } from "./executable/ExpectOperationDefinition";
import { ExpectDirectiveDefinition } from "./typeSystem/definition/ExpectDirectiveDefinition";
import { ExpectEnumTypeDefinition } from "./typeSystem/definition/ExpectEnumTypeDefinition";
import { ExpectInputObjectTypeDefinition } from "./typeSystem/definition/ExpectInputObjectTypeDefinition";
import { ExpectInterfaceTypeDefinition } from "./typeSystem/definition/ExpectInterfaceTypeDefinition";
import { ExpectObjectTypeDefinition } from "./typeSystem/definition/ExpectObjectTypeDefinition";
import { ExpectScalarTypeDefinition } from "./typeSystem/definition/ExpectScalarTypeDefinition";
import { ExpectSchemaDefinition } from "./typeSystem/definition/ExpectSchemaDefinition";
import { ExpectUnionTypeDefinition } from "./typeSystem/definition/ExpectUnionTypeDefinition";
import { ExpectTypeSystemDefinitionOrExtensionStartsWithDescription } from "./typeSystem/ExpectTypeSystemDefinitionOrExtensionStartsWithDescription";

export type ExpectDefinition<S extends string> = S extends `{${string}`
  ? ExpectOperationDefinition<S>
  : S extends `"${string}`
  ? ExpectTypeSystemDefinitionOrExtensionStartsWithDescription<S>
  : ExpectName<S> extends {
      type: "ok";
      value: infer Keyword extends string;
    }
  ? Keyword extends "query" | "mutation" | "subscription"
    ? ExpectOperationDefinition<S>
    : Keyword extends "fragment"
    ? ExpectFragmentDefinition<S>
    : Keyword extends "schema"
    ? ExpectSchemaDefinition<S, undefined>
    : Keyword extends "directive"
    ? ExpectDirectiveDefinition<S, undefined>
    : Keyword extends "scalar"
    ? ExpectScalarTypeDefinition<S, undefined>
    : Keyword extends "type"
    ? ExpectObjectTypeDefinition<S, undefined>
    : Keyword extends "interface"
    ? ExpectInterfaceTypeDefinition<S, undefined>
    : Keyword extends "union"
    ? ExpectUnionTypeDefinition<S, undefined>
    : Keyword extends "input"
    ? ExpectInputObjectTypeDefinition<S, undefined>
    : Keyword extends "enum"
    ? ExpectEnumTypeDefinition<S, undefined>
    : Keyword extends "extend"
    ? ExpectTypeSystemExtensionDefinition<S, undefined>
    : Ensure<{ type: "error"; error: "Expected keyword" }, ExpectResultError>
  : Ensure<
      { type: "error"; error: "Expected { or description or keyword" },
      ExpectResultError
    >;

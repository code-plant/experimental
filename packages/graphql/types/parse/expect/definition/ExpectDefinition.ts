import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError } from "../../internal-types";
import { ExpectName } from "../ExpectName";
import { ExpectFragmentDefinition } from "./executable/ExpectFragmentDefinition";
import { ExpectOperationDefinition } from "./executable/ExpectOperationDefinition";
import { ExpectDirectiveDefinitionAfterDescription } from "./typeSystem/definition/ExpectDirectiveDefinitionAfterDescription";
import { ExpectEnumTypeDefinitionAfterDescription } from "./typeSystem/definition/ExpectEnumTypeDefinitionAfterDescription";
import { ExpectInputObjectTypeDefinitionAfterDescription } from "./typeSystem/definition/ExpectInputObjectTypeDefinitionAfterDescription";
import { ExpectInterfaceTypeDefinitionAfterDescription } from "./typeSystem/definition/ExpectInterfaceTypeDefinitionAfterDescription";
import { ExpectObjectTypeDefinitionAfterDescription } from "./typeSystem/definition/ExpectObjectTypeDefinitionAfterDescription";
import { ExpectScalarTypeDefinitionAfterDescription } from "./typeSystem/definition/ExpectScalarTypeDefinitionAfterDescription";
import { ExpectSchemaDefinitionAfterDescription } from "./typeSystem/definition/ExpectSchemaDefinitionAfterDescription";
import { ExpectUnionTypeDefinitionAfterDescription } from "./typeSystem/definition/ExpectUnionTypeDefinitionAfterDescription";
import { ExpectTypeSystemDefinitionOrExtensionStartsWithDescription } from "./typeSystem/ExpectTypeSystemDefinitionOrExtensionStartsWithDescription";
import { ExpectTypeSystemExtensionAfterExtend } from "./typeSystem/extension/ExpectTypeSystemExtensionAfterExtend";

export type ExpectDefinition<S extends string> = S extends `{${string}`
  ? ExpectOperationDefinition<S>
  : S extends `"${string}`
  ? ExpectTypeSystemDefinitionOrExtensionStartsWithDescription<S>
  : ExpectName<S> extends {
      type: "ok";
      value: infer Keyword extends string;
      rest: infer A extends string;
    }
  ? Keyword extends "query" | "mutation" | "subscription"
    ? ExpectOperationDefinition<S>
    : Keyword extends "fragment"
    ? ExpectFragmentDefinition<S>
    : Keyword extends "schema"
    ? ExpectSchemaDefinitionAfterDescription<S, undefined>
    : Keyword extends "directive"
    ? ExpectDirectiveDefinitionAfterDescription<S, undefined>
    : Keyword extends "scalar"
    ? ExpectScalarTypeDefinitionAfterDescription<S, undefined>
    : Keyword extends "type"
    ? ExpectObjectTypeDefinitionAfterDescription<S, undefined>
    : Keyword extends "interface"
    ? ExpectInterfaceTypeDefinitionAfterDescription<S, undefined>
    : Keyword extends "union"
    ? ExpectUnionTypeDefinitionAfterDescription<S, undefined>
    : Keyword extends "enum"
    ? ExpectEnumTypeDefinitionAfterDescription<S, undefined>
    : Keyword extends "input"
    ? ExpectInputObjectTypeDefinitionAfterDescription<S, undefined>
    : Keyword extends "extend"
    ? ExpectTypeSystemExtensionAfterExtend<A>
    : Ensure<{ type: "error"; error: "Expected keyword" }, ExpectResultError>
  : Ensure<
      { type: "error"; error: "Expected { or description or keyword" },
      ExpectResultError
    >;

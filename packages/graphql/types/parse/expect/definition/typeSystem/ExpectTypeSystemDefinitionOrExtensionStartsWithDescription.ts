import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError } from "../../../internal-types";
import { ExpectName } from "../../ExpectName";
import { ExpectString } from "../../ExpectString";
import { ExpectDirectiveDefinitionAfterDescription } from "./definition/ExpectDirectiveDefinitionAfterDescription";
import { ExpectEnumTypeDefinitionAfterDescription } from "./definition/ExpectEnumTypeDefinitionAfterDescription";
import { ExpectInputObjectTypeDefinitionAfterDescription } from "./definition/ExpectInputObjectTypeDefinitionAfterDescription";
import { ExpectInterfaceTypeDefinitionAfterDescription } from "./definition/ExpectInterfaceTypeDefinitionAfterDescription";
import { ExpectObjectTypeDefinitionAfterDescription } from "./definition/ExpectObjectTypeDefinitionAfterDescription";
import { ExpectScalarTypeDefinitionAfterDescription } from "./definition/ExpectScalarTypeDefinitionAfterDescription";
import { ExpectSchemaDefinitionAfterDescription } from "./definition/ExpectSchemaDefinitionAfterDescription";
import { ExpectUnionTypeDefinitionAfterDescription } from "./definition/ExpectUnionTypeDefinitionAfterDescription";

export type ExpectTypeSystemDefinitionOrExtensionStartsWithDescription<
  S extends string
> = ExpectString<S, "top level"> extends infer I
  ? I extends {
      type: "ok";
      value: infer Description extends string;
      rest: infer A extends string;
    }
    ? ExpectName<A, "top level"> extends infer I
      ? I extends {
          type: "ok";
          value: infer Keyword extends string;
        }
        ? Keyword extends "schema"
          ? ExpectSchemaDefinitionAfterDescription<A, Description>
          : Keyword extends "directive"
          ? ExpectDirectiveDefinitionAfterDescription<A, Description>
          : Keyword extends "scalar"
          ? ExpectScalarTypeDefinitionAfterDescription<A, Description>
          : Keyword extends "type"
          ? ExpectObjectTypeDefinitionAfterDescription<A, Description>
          : Keyword extends "interface"
          ? ExpectInterfaceTypeDefinitionAfterDescription<A, Description>
          : Keyword extends "union"
          ? ExpectUnionTypeDefinitionAfterDescription<A, Description>
          : Keyword extends "enum"
          ? ExpectEnumTypeDefinitionAfterDescription<A, Description>
          : Keyword extends "input"
          ? ExpectInputObjectTypeDefinitionAfterDescription<A, Description>
          : Ensure<
              { type: "error"; error: "Expected keyword"; on: "top level" },
              ExpectResultError
            >
        : I
      : never
    : I
  : never;

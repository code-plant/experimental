import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError } from "../../../internal-types";
import { ExpectName } from "../../ExpectName";
import { ExpectString } from "../../ExpectString";
import { ExpectDirectiveDefinition } from "./definition/ExpectDirectiveDefinition";
import { ExpectEnumTypeDefinition } from "./definition/ExpectEnumTypeDefinition";
import { ExpectInputObjectTypeDefinition } from "./definition/ExpectInputObjectTypeDefinition";
import { ExpectInterfaceTypeDefinition } from "./definition/ExpectInterfaceTypeDefinition";
import { ExpectObjectTypeDefinition } from "./definition/ExpectObjectTypeDefinition";
import { ExpectScalarTypeDefinition } from "./definition/ExpectScalarTypeDefinition";
import { ExpectSchemaDefinition } from "./definition/ExpectSchemaDefinition";
import { ExpectUnionTypeDefinition } from "./definition/ExpectUnionTypeDefinition";

export type ExpectTypeSystemDefinitionOrExtensionStartsWithDescription<
  S extends string
> = ExpectString<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Description extends string;
      rest: infer R extends string;
    }
    ? ExpectName<S> extends infer I
      ? I extends {
          type: "ok";
          value: infer Keyword extends string;
        }
        ? Keyword extends "schema"
          ? ExpectSchemaDefinition<S, Description>
          : Keyword extends "directive"
          ? ExpectDirectiveDefinition<S, Description>
          : Keyword extends "scalar"
          ? ExpectScalarTypeDefinition<S, Description>
          : Keyword extends "type"
          ? ExpectObjectTypeDefinition<S, Description>
          : Keyword extends "interface"
          ? ExpectInterfaceTypeDefinition<S, Description>
          : Keyword extends "union"
          ? ExpectUnionTypeDefinition<S, Description>
          : Keyword extends "input"
          ? ExpectInputObjectTypeDefinition<S, Description>
          : Keyword extends "enum"
          ? ExpectEnumTypeDefinition<S, Description>
          : Keyword extends "extend"
          ? ExpectTypeSystemExtensionDefinition<S, Description>
          : Ensure<
              { type: "error"; error: "Expected keyword" },
              ExpectResultError
            >
        : I
      : never
    : I
  : never;

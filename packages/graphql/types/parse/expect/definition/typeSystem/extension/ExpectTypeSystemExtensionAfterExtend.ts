import { ExpectName } from "../../../ExpectName";
import { ExpectEnumTypeExtensionAfterEnum } from "./ExpectEnumTypeExtensionAfterEnum";
import { ExpectInputObjectTypeExtensionAfterInput } from "./ExpectInputObjectTypeExtensionAfterInput";
import { ExpectInterfaceTypeExtensionAfterInterface } from "./ExpectInterfaceTypeExtensionAfterInterface";
import { ExpectObjectTypeExtensionAfterType } from "./ExpectObjectTypeExtensionAfterType";
import { ExpectScalarTypeExtensionAfterScalar } from "./ExpectScalarTypeExtensionAfterScalar";
import { ExpectSchemaExtensionAfterSchema } from "./ExpectSchemaExtensionAfterSchema";
import { ExpectUnionTypeExtensionAfterUnion } from "./ExpectUnionTypeExtensionAfterUnion";

export type ExpectTypeSystemExtensionAfterExtend<S extends string> =
  ExpectName<S> extends infer I
    ? I extends {
        type: "ok";
        value: infer Keyword extends string;
        rest: infer A extends string;
      }
      ? Keyword extends "schema"
        ? ExpectSchemaExtensionAfterSchema<A>
        : Keyword extends "scalar"
        ? ExpectScalarTypeExtensionAfterScalar<A>
        : Keyword extends "type"
        ? ExpectObjectTypeExtensionAfterType<A>
        : Keyword extends "interface"
        ? ExpectInterfaceTypeExtensionAfterInterface<A>
        : Keyword extends "union"
        ? ExpectUnionTypeExtensionAfterUnion<A>
        : Keyword extends "enum"
        ? ExpectEnumTypeExtensionAfterEnum<A>
        : Keyword extends "input"
        ? ExpectInputObjectTypeExtensionAfterInput<A>
        : never
      : I
    : never;

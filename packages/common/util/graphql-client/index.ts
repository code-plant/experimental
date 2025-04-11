import {
  GraphQLEnumType,
  GraphQLField,
  GraphQLInputType,
  GraphQLInterfaceType,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLSchema,
  GraphQLTerminalType,
  GraphQLType,
  GraphQLUnionType,
} from "@this-project/common-util-graphql-client-types";
import { UnionToIntersection } from "@this-project/common-util-types";

export interface SchemaDescription<T extends GraphQLSchema> {
  query: "query" extends keyof T
    ? [Exclude<T["query"], undefined>] extends [never]
      ? "Error: query cannot be undefined" & { " error": never }
      : ObjectTypeDescription<Exclude<T["query"], undefined>>
    : undefined;
  mutation: "mutation" extends keyof T
    ? [Exclude<T["mutation"], undefined>] extends [never]
      ? "Error: mutation cannot be undefined" & { " error": never }
      : ObjectTypeDescription<Exclude<T["mutation"], undefined>>
    : undefined;
  subscription: "subscription" extends keyof T
    ? [Exclude<T["subscription"], undefined>] extends [never]
      ? "Error: subscription cannot be undefined" & { " error": never }
      : ObjectTypeDescription<Exclude<T["subscription"], undefined>>
    : undefined;
}

export type TypeDescription<T extends GraphQLType> = [T] extends [
  infer I extends GraphQLTerminalType
]
  ? {
      type: "terminal";
      nullable: false;
      item: TerminalTypeDescription<I>;
    }
  : [T] extends [infer I extends GraphQLTerminalType | null]
  ? {
      type: "terminal";
      nullable: true;
      item: TerminalTypeDescription<Exclude<I, null>>;
    }
  : [T] extends [infer I extends GraphQLType[]]
  ? {
      type: "array";
      nullable: false;
      item: TypeDescription<I[number]>;
    }
  : [T] extends [infer I extends GraphQLType[] | null]
  ? {
      type: "array";
      nullable: true;
      item: TypeDescription<Exclude<I, null>[number]>;
    }
  : never;

export type TerminalTypeDescription<T extends GraphQLTerminalType> = [
  T
] extends [GraphQLScalarType]
  ? ScalarTypeDescription<T>
  : [T] extends [GraphQLObjectType]
  ? ObjectTypeDescription<T>
  : [T] extends [GraphQLInterfaceType]
  ? InterfaceTypeDescription<T>
  : [T] extends [GraphQLUnionType]
  ? UnionTypeDescription<T>
  : [T] extends [GraphQLEnumType]
  ? EnumTypeDescription<T>
  : [T] extends [GraphQLInputType]
  ? InputTypeDescription<T>
  : never;

export type ScalarTypeDescription<T extends GraphQLScalarType> = T;

export type ObjectTypeDescription<T extends GraphQLObjectType> = {
  type: "object";
  name: T["name"];
  implementsInterfaces: {
    [K in Exclude<T["implementsInterfaces"], undefined>[number]["name"]]-?: [
      UnionToIntersection<
        Extract<
          Exclude<T["implementsInterfaces"], undefined>[number],
          Record<"name", K>
        >
      >
    ] extends [
      Extract<
        Exclude<T["implementsInterfaces"], undefined>[number],
        Record<"name", K>
      >
    ]
      ? InterfaceTypeDescription<
          Extract<
            Exclude<T["implementsInterfaces"], undefined>[number],
            Record<"name", K>
          >
        >
      : "Error: duplicate name in implementsInterfaces" & { " error": never };
  };
  fields: FieldsDescription<T["fields"]>;
};

export type FieldsDescription<T> = {
  [K in keyof T]-?: [T[K]] extends [GraphQLField]
    ? FieldDescription<T[K]>
    : "Error: field must not be undefinable" & { " error": never };
};

export type FieldDescription<T extends GraphQLField> = {
  args: {
    [K in keyof T["args"]]-?: T["args"][K] extends GraphQLType
      ? InputOnlyTypeDescription<T["args"][K]>
      : "Error: arg must not be undefinable" & { " error": never };
  };
  value: TypeDescription<T["value"]>;
};

export type InterfaceTypeDescription<T extends GraphQLInterfaceType> = {
  type: "interface";
  name: T["name"];
  implementsInterfaces: {
    [K in Exclude<T["implementsInterfaces"], undefined>[number]["name"]]-?: [
      UnionToIntersection<
        Extract<
          Exclude<T["implementsInterfaces"], undefined>[number],
          Record<"name", K>
        >
      >
    ] extends [
      Extract<
        Exclude<T["implementsInterfaces"], undefined>[number],
        Record<"name", K>
      >
    ]
      ? InterfaceTypeDescription<
          Extract<
            Exclude<T["implementsInterfaces"], undefined>[number],
            Record<"name", K>
          >
        >
      : "Error: duplicate name in implementsInterfaces" & { " error": never };
  };
  fields: FieldsDescription<T["fields"]>;
};

export type UnionTypeDescription<T extends GraphQLUnionType> = {
  type: "union";
  name: T["name"];
  variants: {
    [K in Exclude<T["variants"], undefined>[number]["name"]]-?: [
      UnionToIntersection<
        Extract<Exclude<T["variants"], undefined>[number], Record<"name", K>>
      >
    ] extends [
      Extract<Exclude<T["variants"], undefined>[number], Record<"name", K>>
    ]
      ? ObjectTypeDescription<
          Extract<Exclude<T["variants"], undefined>[number], Record<"name", K>>
        >
      : "Error: duplicate name in variants" & { " error": never };
  };
};

export type EnumTypeDescription<T extends GraphQLEnumType> = {
  type: "enum";
  name: T["name"];
  members: Record<T["members"][number], true>;
};

export type InputTypeDescription<T extends GraphQLInputType> = {
  type: "input";
  name: T["name"];
  fields: InputOnlyFieldsDescription<T["fields"]>;
};

export type InputOnlyFieldsDescription<T> = {
  [K in keyof T]-?: T[K] extends GraphQLField
    ? InputOnlyFieldDescription<T[K]>
    : "Error: field must not be undefinable" & { " error": never };
};

export type InputOnlyFieldDescription<T extends GraphQLField> = {
  args: {
    [K in keyof T["args"]]-?: T["args"][K] extends GraphQLType
      ? InputOnlyTypeDescription<T["args"][K]>
      : "Error: arg must not be undefinable" & { " error": never };
  };
  value: InputOnlyTypeDescription<T["value"]>;
};

export type InputOnlyTypeDescription<T extends GraphQLType> = [T] extends [
  infer I extends GraphQLTerminalType
]
  ? {
      type: "terminal";
      nullable: false;
      item: InputOnlyTerminalTypeDescription<I>;
    }
  : [T] extends [infer I extends GraphQLTerminalType | null]
  ? {
      type: "terminal";
      nullable: true;
      item: InputOnlyTerminalTypeDescription<Exclude<I, null>>;
    }
  : [T] extends [infer I extends GraphQLType[]]
  ? {
      type: "array";
      nullable: false;
      item: InputOnlyTypeDescription<I[number]>;
    }
  : [T] extends [infer I extends GraphQLType[] | null]
  ? {
      type: "array";
      nullable: true;
      item: InputOnlyTypeDescription<Exclude<I, null>[number]>;
    }
  : never;

export type InputOnlyTerminalTypeDescription<T extends GraphQLTerminalType> = [
  T
] extends [GraphQLScalarType]
  ? ScalarTypeDescription<T>
  : [T] extends [GraphQLEnumType]
  ? EnumTypeDescription<T>
  : [T] extends [GraphQLInputType]
  ? InputTypeDescription<T>
  : "Error: argument cannot be non-input type" & { " error": never };

export class GraphqlClientBuilder<Schema extends GraphQLSchema> {
  constructor(private readonly schema: SchemaDescription<Schema>) {}
  // TODO: implement
}

export interface GraphQLSchema {
  query?: GraphQLObjectType;
  mutation?: GraphQLObjectType;
  subscription?: GraphQLObjectType;
}

export type GraphQLType = GraphQLTerminalType | null | GraphQLType[];

export type GraphQLTerminalType =
  | GraphQLScalarType
  | GraphQLObjectType
  | GraphQLInterfaceType
  | GraphQLUnionType
  | GraphQLEnumType
  | GraphQLInputType;

export type GraphQLScalarType = {
  type: "scalar";
  name: GraphQLBuiltinType | string;
};

export type GraphQLBuiltinType = "Int" | "Float" | "String" | "Boolean" | "ID";

export type GraphQLObjectType = {
  type: "object";
  name: string;
  implementsInterfaces?: GraphQLInterfaceType[];
  fields: Partial<Record<string, GraphQLField>>;
};

export type GraphQLInterfaceType = {
  type: "interface";
  name: string;
  implementsInterfaces?: GraphQLInterfaceType[];
  fields: Partial<Record<string, GraphQLField>>;
};

export interface GraphQLField {
  args?: Partial<Record<string, GraphQLType>>;
  value: GraphQLType;
}

export type GraphQLUnionType = {
  type: "union";
  name: string;
  variants: GraphQLObjectType[];
};

export type GraphQLEnumType = { type: "enum"; name: string; members: string[] };

export type GraphQLInputType = {
  type: "input";
  name: string;
  fields: Partial<Record<string, GraphQLType>>;
};

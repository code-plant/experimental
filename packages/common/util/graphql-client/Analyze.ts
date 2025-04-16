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
import { UnionAny } from "@this-project/common-util-types";
import { GraphQLExecutableDefintion, GraphQLOperationType } from "./Parse";

type TypeMap = Partial<Record<string, GraphQLTerminalType>>;

type TypeMapFromSchema<T extends GraphQLSchema> =
  T["query"] extends GraphQLObjectType
    ? TypeMapFromObjectType<T["query"], {}> extends infer I extends TypeMap
      ? TypeMapFromSchemaInternal1<T, I>
      : never
    : TypeMapFromSchemaInternal1<T, {}>;

type TypeMapFromSchemaInternal1<
  T extends GraphQLSchema,
  R extends TypeMap
> = T["mutation"] extends GraphQLObjectType
  ? TypeMapFromObjectType<T["mutation"], R> extends infer I extends TypeMap
    ? TypeMapFromSchemaInternal2<T, I>
    : never
  : TypeMapFromSchemaInternal2<T, R>;

type TypeMapFromSchemaInternal2<
  T extends GraphQLSchema,
  R extends TypeMap
> = T["subscription"] extends GraphQLObjectType
  ? TypeMapFromObjectType<T["subscription"], R>
  : R;

type TerminalTypeToTypeMap<T extends GraphQLTerminalType> = {
  [K in T["name"]]: T;
};

type NeverTo<T, R> = [T] extends [never] ? R : T;

type TypeMapFromObjectType<
  T extends GraphQLObjectType,
  R extends TypeMap
> = T["name"] extends keyof R
  ? R
  : TypeMapFromImplementsInterfaces<
      NeverTo<Exclude<T["implementsInterfaces"], undefined>, []>,
      R & TerminalTypeToTypeMap<T>
    > extends infer I extends TypeMap
  ? TypeMapFromFields<T["fields"], I>
  : never;

type TypeMapFromInterfaceType<
  T extends GraphQLInterfaceType,
  R extends TypeMap
> = T["name"] extends keyof R
  ? R
  : TypeMapFromImplementsInterfaces<
      NeverTo<Exclude<T["implementsInterfaces"], undefined>, []>,
      R & TerminalTypeToTypeMap<T>
    > extends infer I extends TypeMap
  ? TypeMapFromFields<T["fields"], I>
  : never;

type TypeMapFromImplementsInterfaces<
  T extends GraphQLInterfaceType[],
  R extends TypeMap
> = T extends [
  infer I extends GraphQLInterfaceType,
  ...infer J extends GraphQLInterfaceType[]
]
  ? TypeMapFromInterfaceType<I, R> extends infer K extends TypeMap
    ? TypeMapFromImplementsInterfaces<J, K>
    : never
  : R;

type TypeMapFromFields<
  T extends Partial<Record<string, GraphQLField>>,
  R extends TypeMap
> = TypeMapFromFieldsInternal<T, R> extends [
  infer T extends Partial<Record<string, GraphQLField>>,
  infer R extends TypeMap
]
  ? [keyof T] extends [never]
    ? R
    : TypeMapFromFields<T, R>
  : never;

type TypeMapFromFieldsInternal<
  T extends Partial<Record<string, GraphQLField>>,
  R extends TypeMap
> = [keyof T] extends [never]
  ? [{}, R]
  : UnionAny<keyof T> extends infer I extends keyof T
  ? [Exclude<T[I], undefined>] extends [never]
    ? [Omit<T, I>, R]
    : [Omit<T, I>, TypeMapFromField<Exclude<T[I], undefined>, R>]
  : never;

type TypeMapFromField<T extends GraphQLField, R extends TypeMap> = (
  [Exclude<T["args"], undefined>] extends [never]
    ? R
    : TypeMapFromArgs<Exclude<T["args"], undefined>, R>
) extends infer I extends TypeMap
  ? TypeMapFromType<T["value"], I>
  : never;

type TypeMapFromArgs<
  T extends Partial<Record<string, GraphQLType>>,
  R extends TypeMap
> = TypeMapFromArgsInternal<T, R> extends [
  infer T extends Partial<Record<string, GraphQLType>>,
  infer R extends TypeMap
]
  ? [keyof T] extends [never]
    ? R
    : TypeMapFromArgs<T, R>
  : never;

type TypeMapFromArgsInternal<
  T extends Partial<Record<string, GraphQLType>>,
  R extends TypeMap
> = [keyof T] extends [never]
  ? [{}, R]
  : UnionAny<keyof T> extends infer I extends keyof T
  ? [Exclude<T[I], undefined>] extends [never]
    ? [Omit<T, I>, R]
    : [Omit<T, I>, TypeMapFromType<Exclude<T[I], undefined>, R>]
  : never;

type TypeMapFromType<
  T extends GraphQLType,
  R extends TypeMap
> = T extends GraphQLTerminalType
  ? TypeMapFromTerminalType<T, R>
  : T extends (null | infer I extends GraphQLType)[]
  ? TypeMapFromType<I, R>
  : never;

type TypeMapFromTerminalType<
  T extends GraphQLTerminalType,
  R extends TypeMap
> = T extends GraphQLScalarType
  ? TypeMapFromScalarType<T, R>
  : T extends GraphQLObjectType
  ? TypeMapFromObjectType<T, R>
  : T extends GraphQLInterfaceType
  ? TypeMapFromInterfaceType<T, R>
  : T extends GraphQLUnionType
  ? TypeMapFromUnionType<T, R>
  : T extends GraphQLEnumType
  ? TypeMapFromEnumType<T, R>
  : T extends GraphQLInputType
  ? TypeMapFromInputType<T, R>
  : never;

type TypeMapFromScalarType<
  T extends GraphQLScalarType,
  R extends TypeMap
> = T["name"] extends keyof R ? R : R & TerminalTypeToTypeMap<T>;

type TypeMapFromEnumType<
  T extends GraphQLEnumType,
  R extends TypeMap
> = T["name"] extends keyof R ? R : R & TerminalTypeToTypeMap<T>;

type TypeMapFromUnionType<
  T extends GraphQLUnionType,
  R extends TypeMap
> = T["name"] extends keyof R
  ? R
  : TypeMapFromVariants<T["variants"], R & TerminalTypeToTypeMap<T>>;

type TypeMapFromVariants<
  T extends GraphQLObjectType[],
  R extends TypeMap
> = T extends [
  infer I extends GraphQLObjectType,
  infer J extends GraphQLObjectType[]
]
  ? TypeMapFromObjectType<I, R> extends infer K extends TypeMap
    ? TypeMapFromVariants<J, K>
    : never
  : R;

type TypeMapFromInputType<
  T extends GraphQLInputType,
  R extends TypeMap
> = T["name"] extends keyof R
  ? R
  : TypeMapFromArgs<T["fields"], R & TerminalTypeToTypeMap<T>>;

export type AnalyzeSchemaResult =
  | AnalyzeSchemaResultError
  | AnalyzeSchemaResultOk;

export interface AnalyzeSchemaResultError {
  type: "error";
  error: string;
}

export interface AnalyzeSchemaResultOk {
  type: "ok";
  schema: GraphQLSchema;
  typeMap: TypeMap;
  scalarTypes: string;
}

export type AnalyzeSchema<T extends GraphQLSchema> =
  TypeMapFromSchema<T> extends infer I extends TypeMap
    ? IsValidTypes<I> extends true
      ? { type: "ok"; schema: T; typeMap: I; scalarTypes: ScalarTypes<I> }
      : { type: "error"; error: "Schema validation failed" }
    : never;

type IsValidTypes<T extends TypeMap> = {
  [K in keyof T]: T[K] extends GraphQLInputType
    ? IsFieldsAllInputCompatible<T[K]["fields"]>
    : never;
}[keyof T];

type IsFieldsAllInputCompatible<
  T extends Partial<Record<string, GraphQLType>>,
  R extends boolean = never
> = [keyof T] extends [never]
  ? R
  : UnionAny<keyof T> extends infer I extends keyof T
  ? IsFieldsAllInputCompatible<
      Omit<T, I>,
      | R
      | ([Exclude<T[I], undefined>] extends [never]
          ? never
          : TerminalTypeFromType<Exclude<T[I], undefined>> extends
              | GraphQLInputType
              | GraphQLScalarType
              | GraphQLEnumType
          ? true
          : false)
    >
  : never;

type TerminalTypeFromType<T extends GraphQLType> = T extends GraphQLTerminalType
  ? T
  : T extends (null | infer I extends GraphQLType)[]
  ? TerminalTypeFromType<I>
  : never;

type ScalarTypes<T extends TypeMap> = {
  [K in keyof T]: T[K] extends GraphQLScalarType ? K : never;
}[keyof T];

export type AnalyzeResult = AnalyzeResultError | AnalyzeResultOk;

export interface AnalyzeResultError {
  type: "error";
  error: string;
}

export interface AnalyzeResultOk {
  type: "ok";
  namedOperations: Partial<Record<string, GraphQLOperationDefinition>>;
  fragments: Partial<Record<string, GraphQLFragmentDefinition>>;
}

export interface GraphQLOperationDefinition {
  type: "operation";
  operationType: GraphQLOperationType;
  name: string;
  variables: Partial<Record<string, GraphQLType>>;
  selectionSet: GraphQLSelectionSet;
}

export interface GraphQLFragmentDefinition {
  type: "fragment";
  name: string;
  typeCondition: string;
  selectionSet: GraphQLSelectionSet;
}

export interface GraphQLSelectionSet {
  fields: Partial<Record<string, GraphQLField>>;
  fragmentSpreads: GraphQLFragmentSpread[];
  inlineFragments: GraphQLInlineFragment[];
}

export interface GraphQLFragmentSpread {
  name: string;
  includeIf?: string;
  skipIf?: string;
}

export interface GraphQLInlineFragment {
  typeCondition?: string;
  selectionSet: GraphQLSelectionSet;
  includeIf?: string;
  skipIf?: string;
}

export type Analyze<T extends GraphQLExecutableDefintion> = {
  type: "error";
  error: "// TODO: not implemented";
};

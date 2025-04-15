import {
  GraphQLObjectType,
  GraphQLSchema,
} from "@this-project/common-util-graphql-client-types";
import { Ensure, ExpandRecursively } from "@this-project/common-util-types";
import { AnalyzeSchema } from "../Analyze";

type ConnectionArgsType = {
  first: { type: "scalar"; name: "Int" } | null;
  last: { type: "scalar"; name: "Int" } | null;
  after: { type: "scalar"; name: "ID" } | null;
  before: { type: "scalar"; name: "ID" } | null;
};

type PageInfoType = Ensure<
  {
    type: "object";
    name: "PageInfo";
    fields: {
      hasNextPage: { value: { type: "scalar"; name: "Boolean" } };
      hasPreviousPage: { value: { type: "scalar"; name: "Boolean" } };
      startCursor: { value: { type: "scalar"; name: "ID" } };
      endCursor: { value: { type: "scalar"; name: "ID" } };
    };
  },
  GraphQLObjectType
>;

type ConnectionWithTotalType<T extends GraphQLObjectType> = Ensure<
  {
    type: "object";
    name: `${T["name"]}ConnectionWithTotal`;
    fields: {
      pageInfo: { value: PageInfoType };
      edges: { value: EdgeType<T>[] };
      total: { value: { type: "scalar"; name: "Int" } };
    };
  },
  GraphQLObjectType
>;

type EdgeType<T extends GraphQLObjectType> = Ensure<
  {
    type: "object";
    name: `${T["name"]}Edge`;
    fields: {
      node: { value: T };
      cursor: { value: { type: "scalar"; name: "ID" } };
    };
  },
  GraphQLObjectType
>;

type QueryType = Ensure<
  {
    type: "object";
    name: "Query";
    fields: {
      users: {
        args: ConnectionArgsType & {
          cursor: { type: "scalar"; name: "ID" } | null;
        };
        value: ConnectionWithTotalType<UserType>;
      };
    };
  },
  GraphQLObjectType
>;

type UserType = Ensure<
  {
    type: "object";
    name: "User";
    fields: {
      name: { value: { type: "scalar"; name: "String" } };
    };
  },
  GraphQLObjectType
>;

type SchemaType = Ensure<{ query: QueryType }, GraphQLSchema>;

export type AnalyzedSchema = ExpandRecursively<AnalyzeSchema<SchemaType>>;

export { type SchemaType as Schema };

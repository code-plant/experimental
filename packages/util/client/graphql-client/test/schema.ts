import {
  GraphQLEnumType,
  GraphQLInputType,
  GraphQLObjectType,
  GraphQLSchema,
} from "@this-project/util-common-graphql-common-types";
import { Ensure } from "@this-project/util-types-common";
import { AnalyzeSchema, AnalyzeSchemaResultOk } from "../Analyze";

type ConnectionArgs = {
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
      nodes: { value: T[] };
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

type SearchOrderType<Name extends string, Fields extends string[]> = Ensure<
  {
    type: "input";
    name: `${Name}SearchOrder`;
    fields: {
      field: Ensure<
        { type: "enum"; name: `${Name}SearchOrderField`; members: Fields },
        GraphQLEnumType
      >;
      direction: SearchOrderDirection;
    };
  },
  GraphQLInputType
>;

type SearchOrderDirection = Ensure<
  { type: "enum"; name: "SearchOrderDirection"; members: ["ASC", "DESC"] },
  GraphQLEnumType
>;

type QueryType = Ensure<
  {
    type: "object";
    name: "Query";
    fields: {
      users: {
        args: ConnectionArgs & {
          query: { type: "scalar"; name: "String" } | null;
          order: SearchOrderType<
            "User",
            ["name", "registeredAt", "lastActiveAt"]
          > | null;
          filter: UserSearchFilterType | null;
        };
        value: ConnectionWithTotalType<UserType>;
      };
      user: {
        args: { id: { type: "scalar"; name: "ID" } };
        value: UserType | null;
      };
      posts: {
        args: ConnectionArgs & {
          query: { type: "scalar"; name: "String" } | null;
          order: SearchOrderType<
            "Post",
            ["title", "publishedAt", "lastActiveAt"]
          > | null;
          filter: UserSearchFilterType | null;
        };
        value: ConnectionWithTotalType<PostType>;
      };
      post: {
        args: { id: { type: "scalar"; name: "ID" } };
        value: PostType | null;
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
      registeredAt: { value: { type: "scalar"; name: "DateTime" } };
      lastActiveAt: { value: { type: "scalar"; name: "DateTime" } };
      recentPosts: {
        args: { count: { type: "scalar"; name: "Int" } | null };
        value: PostType[];
      };
    };
  },
  GraphQLObjectType
>;

type UserSearchFilterType = Ensure<
  {
    type: "input";
    name: "UserSearchFilter";
    fields: {
      name: { type: "scalar"; name: "String" } | null;
    };
  },
  GraphQLInputType
>;

type PostType = Ensure<
  {
    type: "object";
    name: "Post";
    fields: {
      title: { value: { type: "scalar"; name: "String" } };
      publishedAt: { value: { type: "scalar"; name: "DateTime" } };
      lastActiveAt: { value: { type: "scalar"; name: "DateTime" } };
      author: { value: UserType };
    };
  },
  GraphQLObjectType
>;

type SchemaType = Ensure<{ query: QueryType }, GraphQLSchema>;

export type AnalyzedSchema = Ensure<
  AnalyzeSchema<SchemaType>,
  AnalyzeSchemaResultOk
>;

import { GraphQLSchema } from "@this-project/util-common-graphql-common-types";
import { GraphQLResult } from "./GraphQLResult";

export interface GraphQLOptions {
  customFetch?: typeof fetch;
  headers?: Record<string, string>;
}

export function graphql<
  Schema extends GraphQLSchema,
  ScalarTypeMap extends Record<GatherScalarTypesFromSchema<Schema>, unknown>,
  const Query extends string
>(
  serverUrl: string,
  path: string,
  query: Query,
  options: GraphQLOptions = {}
): GraphQLResult<Schema, ScalarTypeMap, Query> {
  // TODO:
}

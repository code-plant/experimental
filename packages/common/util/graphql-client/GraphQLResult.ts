import { GraphQLSchema } from "@this-project/common-util-graphql-client-types";
import { graphql } from ".";
import { Parse } from "./Parse";

export type GraphQLResult<
  Schema extends GraphQLSchema,
  ScalarTypeMap extends Partial<Record<string, unknown>>,
  Query extends string
> = Parse<Query>; // TODO:

type ExpandRecursively<T> = T extends object
  ? T extends infer I
    ? { [K in keyof I]: ExpandRecursively<I[K]> }
    : never
  : T;

const source = "fragment a on User { id }" as const;

const a = graphql("", "", source);
type A = ExpandRecursively<typeof a>;

type B = ExpandRecursively<Parse<typeof source>>;

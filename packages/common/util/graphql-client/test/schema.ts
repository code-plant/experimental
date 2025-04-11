import {
  GraphQLObjectType,
  GraphQLSchema,
} from "@this-project/common-util-graphql-client-types";
import { Ensure } from "@this-project/common-util-types";
import {
  FieldsDescription,
  ObjectTypeDescription,
  SchemaDescription,
  TerminalTypeDescription,
} from "..";

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

const String = {
  type: "scalar",
  name: "String",
} as const satisfies TerminalTypeDescription<{
  type: "scalar";
  name: "String";
}>;

const ID = {
  type: "scalar",
  name: "ID",
} as const satisfies TerminalTypeDescription<{
  type: "scalar";
  name: "ID";
}>;

const Int = {
  type: "scalar",
  name: "Int",
} as const satisfies TerminalTypeDescription<{
  type: "scalar";
  name: "Int";
}>;

const Float = {
  type: "scalar",
  name: "Float",
} as const satisfies TerminalTypeDescription<{
  type: "scalar";
  name: "Float";
}>;

const Boolean = {
  type: "scalar",
  name: "Boolean",
} as const satisfies TerminalTypeDescription<{
  type: "scalar";
  name: "Boolean";
}>;

class SchemaTypeDescription implements SchemaDescription<SchemaType> {
  query: ObjectTypeDescription<QueryType>;
  mutation: undefined;
  subscription: undefined;

  private constructor() {
    this.query = {
      type: "object",
      name: "Query",
      implementsInterfaces: {},
      fields: {
        users: {
          args: {
            first: {
              type: "terminal",
              nullable: true,
              item: Int,
            },
            last: {
              type: "terminal",
              nullable: true,
              item: Int,
            },
            after: {
              type: "terminal",
              nullable: true,
              item: ID,
            },
            before: {
              type: "terminal",
              nullable: true,
              item: ID,
            },
            cursor: {
              type: "terminal",
              nullable: true,
              item: ID,
            },
          },
          value: {
            type: "terminal",
            nullable: false,
            item: UserConnectionWithTotalTypeDescription.instance(),
          },
        },
      },
    };
  }

  private static _instance: SchemaTypeDescription | undefined;
  static instance() {
    return (this._instance ??= new SchemaTypeDescription());
  }
}

class UserTypeDescription implements ObjectTypeDescription<UserType> {
  type: "object";
  name: "User";
  implementsInterfaces: {};
  fields: FieldsDescription<UserType["fields"]>;

  private constructor() {
    this.type = "object";
    this.name = "User";
    this.implementsInterfaces = {};
    this.fields = {
      name: {
        args: {},
        value: { type: "terminal", nullable: false, item: String },
      },
    };
  }

  private static _instance: UserTypeDescription | undefined;
  static instance() {
    return (this._instance ??= new UserTypeDescription());
  }
}

const PageInfoTypeDescription: TerminalTypeDescription<PageInfoType> = {
  type: "object",
  name: "PageInfo",
  implementsInterfaces: {},
  fields: {
    hasNextPage: {
      args: {},
      value: { type: "terminal", nullable: false, item: Boolean },
    },
    hasPreviousPage: {
      args: {},
      value: { type: "terminal", nullable: false, item: Boolean },
    },
    endCursor: {
      args: {},
      value: { type: "terminal", nullable: false, item: ID },
    },
    startCursor: {
      args: {},
      value: { type: "terminal", nullable: false, item: ID },
    },
  },
};

class UserConnectionWithTotalTypeDescription
  implements ObjectTypeDescription<ConnectionWithTotalType<UserType>>
{
  type: "object";
  name: "UserConnectionWithTotal";
  implementsInterfaces: {};
  fields: FieldsDescription<ConnectionWithTotalType<UserType>["fields"]>;

  private constructor() {
    this.type = "object";
    (this.name = "UserConnectionWithTotal"), (this.implementsInterfaces = {});
    this.fields = {
      pageInfo: {
        args: {},
        value: {
          type: "terminal",
          nullable: false,
          item: PageInfoTypeDescription,
        },
      },
      edges: {
        args: {},
        value: {
          type: "array",
          nullable: false,
          item: {
            type: "terminal",
            nullable: false,
            item: UserEdgeTypeDescription.instance(),
          },
        },
      },
      total: {
        args: {},
        value: {
          type: "terminal",
          nullable: false,
          item: Int,
        },
      },
    };
  }

  private static _instance: UserConnectionWithTotalTypeDescription | undefined;
  static instance(): UserConnectionWithTotalTypeDescription {
    return (this._instance ??= new UserConnectionWithTotalTypeDescription());
  }
}

class UserEdgeTypeDescription
  implements ObjectTypeDescription<EdgeType<UserType>>
{
  type: "object";
  name: "UserEdge";
  implementsInterfaces: {};
  fields: FieldsDescription<EdgeType<UserType>["fields"]>;

  private constructor() {
    this.type = "object";
    this.name = "UserEdge";
    this.implementsInterfaces = {};
    this.fields = {
      cursor: {
        args: {},
        value: { type: "terminal", nullable: false, item: ID },
      },
      node: {
        args: {},
        value: {
          type: "terminal",
          nullable: false,
          item: UserTypeDescription.instance(),
        },
      },
    };
  }

  private static _instance: UserEdgeTypeDescription | undefined;
  static instance(): UserEdgeTypeDescription {
    return (this._instance ??= new UserEdgeTypeDescription());
  }
}

export const schema: SchemaDescription<SchemaType> =
  SchemaTypeDescription.instance();
export { type SchemaType as Schema };

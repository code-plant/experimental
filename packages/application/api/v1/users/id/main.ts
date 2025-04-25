import { Cursor, PageWithTotal } from "@this-project/application-api-common";
import { EnsureAPIRoute } from "@this-project/util-common-types";
import { PostSimpleView } from "../../posts";
import { UserDetailView } from "../types";

export type UserIdMainGet = EnsureAPIRoute<{
  method: "GET";
  path: `/api/v1/users/id/:id`;
  responseType: "json";
  response: UserDetailView;
}>;

export type UserIdMainRoutes = UserIdMainGet;

export type UserIdPostsGet = EnsureAPIRoute<{
  method: "GET";
  path: `/api/v1/users/id/:id/posts`;
  responseType: "json";
  response: PageWithTotal<
    PostSimpleView,
    Cursor<"GET", `/api/v1/users/id/:id/posts`>
  >;
}>;

export type UserIdPostsRoutes = UserIdPostsGet;

export type UserIdRoutes = UserIdMainRoutes | UserIdPostsRoutes;

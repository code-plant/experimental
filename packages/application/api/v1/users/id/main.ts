import { Cursor, PageWithTotal } from "@this-project/application-api-common";
import { Ensure } from "@this-project/util-types-common";
import { APIRouteBase } from "@this-project/util-types-rest";
import { PostSimpleView } from "../../posts";
import { UserDetailView } from "../types";

export type UserIdMainGet = Ensure<
  {
    method: "GET";
    path: `/api/v1/users/id/:id`;
    responseType: "json";
    response: UserDetailView;
  },
  APIRouteBase
>;

export type UserIdMainRoutes = UserIdMainGet;

export type UserIdPostsGet = Ensure<
  {
    method: "GET";
    path: `/api/v1/users/id/:id/posts`;
    responseType: "json";
    response: PageWithTotal<
      PostSimpleView,
      Cursor<"GET", `/api/v1/users/id/:id/posts`>
    >;
  },
  APIRouteBase
>;

export type UserIdPostsRoutes = UserIdPostsGet;

export type UserIdRoutes = UserIdMainRoutes | UserIdPostsRoutes;

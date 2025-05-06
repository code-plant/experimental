import { Ensure } from "@this-project/util-types-common";
import { APIRouteBase } from "@this-project/util-types-rest";
import { UserDetailView } from "./types";

export type UserSlugMainGet = Ensure<
  {
    method: "GET";
    path: `/api/v1/users/slug/:slug`;
    responseType: "json";
    response: UserDetailView;
  },
  APIRouteBase
>;

export type UserSlugMainRoutes = UserSlugMainGet;

export type UserSlugRoutes = UserSlugMainRoutes;

import { EnsureAPIRoute } from "@this-project/common-util-types";
import { UserDetailView } from "./types";

export type UserSlugMainGet = EnsureAPIRoute<{
  method: "GET";
  path: `/api/v1/users/slug/:slug`;
  responseType: "json";
  response: UserDetailView;
}>;

export type UserSlugMainRoutes = UserSlugMainGet;

export type UserSlugRoutes = UserSlugMainRoutes;

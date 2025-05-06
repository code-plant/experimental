import { Ensure } from "@this-project/util-types-common";
import { APIRouteBase } from "@this-project/util-types-rest";
import { UserAuthorizedView } from "./types";

export type UserMeGet = Ensure<
  {
    method: "GET";
    path: "/api/v1/users/me";
    responseType: "json";
    response: UserAuthorizedView;
  },
  APIRouteBase
>;

export type UserMePatch = Ensure<
  {
    method: "PATCH";
    path: "/api/v1/users/me";
    responseType: "json";
    response: UserAuthorizedView;
    requestType: "json";
    request: {
      nickname?: string;
      status?: string | null;
    };
  },
  APIRouteBase
>;

export type UserMeRoutes = UserMeGet | UserMePatch;

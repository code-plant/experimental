import { EnsureAPIRoute } from "@this-project/util-common-types";
import { UserAuthorizedView } from "./types";

export type UserMeGet = EnsureAPIRoute<{
  method: "GET";
  path: "/api/v1/users/me";
  responseType: "json";
  response: UserAuthorizedView;
}>;

export type UserMePatch = EnsureAPIRoute<{
  method: "PATCH";
  path: "/api/v1/users/me";
  responseType: "json";
  response: UserAuthorizedView;
  requestType: "json";
  request: {
    nickname?: string;
    status?: string | null;
  };
}>;

export type UserMeRoutes = UserMeGet | UserMePatch;

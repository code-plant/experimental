import {
  Cursor,
  PageWithTotal,
  Result,
} from "@this-project/application-api-common";
import { EnsureAPIRoute } from "@this-project/util-common-types";
import { UserIdRoutes } from "./id";
import { UserMeGet, UserMeRoutes } from "./me";
import { UserNicknameRoutes } from "./nickname";
import { UserSlugRoutes } from "./slug";
import { UserAuthorizedView, UserSimpleView } from "./types";

export type UserMainGet = EnsureAPIRoute<{
  method: "GET";
  path: "/api/v1/users";
  responseType: "json";
  response: PageWithTotal<UserSimpleView, Cursor<"GET", "/api/v1/users">>;
}>;

export type UserMainPostError =
  | "UNAVAILABLE_LOGIN"
  | "UNAVAILABLE_NICKNAME"
  | "UNAVAILABLE_TAG";

export type UserMainPost = EnsureAPIRoute<{
  method: "POST";
  path: "/api/v1/users";
  responseType: "json";
  response: Result<UserAuthorizedView, UserMainPostError>;
  requestType: "json";
  request: {
    login: string;
    nickname: string;
    password: string;
    tag?: string;
  };
}>;

export type UserMainRoutes = UserMeGet | UserMainPost;

export type UserRoutes =
  | UserMainRoutes
  | UserMeRoutes
  | UserIdRoutes
  | UserSlugRoutes
  | UserNicknameRoutes;

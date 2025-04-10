import { PageWithTotal } from "@this-project/common-api-common";
import { EnsureAPIRoute } from "@this-project/common-util-types";
import { UserAuthorizedView, UserSimpleView } from "./types";

export type UserMainGet = EnsureAPIRoute<{
  method: "GET";
  path: "/api/v1/users";
  responseType: "json";
  response: PageWithTotal<UserSimpleView>;
}>;

export type UserMainPost = EnsureAPIRoute<{
  method: "POST";
  path: "/api/v1/users";
  responseType: "json";
  response: UserAuthorizedView;
  requestType: "json";
  request: {
    login: string;
    nickname: string;
    password: string;
  };
}>;

import { Ensure } from "@this-project/util-types-common";
import { APIRouteBase } from "@this-project/util-types-rest";
import { UserDetailView } from "./types";

export type UserNicknameMainGet = Ensure<
  {
    method: "GET";
    path: `/api/v1/users/nickname/:nickname`;
    responseType: "json";
    response: UserDetailView;
  },
  APIRouteBase
>;

export type UserNicknameMainRoutes = UserNicknameMainGet;

export type UserNicknameRoutes = UserNicknameMainRoutes;

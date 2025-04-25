import { EnsureAPIRoute } from "@this-project/util-common-types";
import { UserDetailView } from "./types";

export type UserNicknameMainGet = EnsureAPIRoute<{
  method: "GET";
  path: `/api/v1/users/nickname/:nickname`;
  responseType: "json";
  response: UserDetailView;
}>;

export type UserNicknameMainRoutes = UserNicknameMainGet;

export type UserNicknameRoutes = UserNicknameMainRoutes;

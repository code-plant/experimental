import { Id } from "@this-project/common-api-common";
import { PostSimpleView } from "../posts/types";

export type UserId = Id<"user">;

export interface UserSimpleView {
  id: UserId;
  nickname: string;
  profileImageThumbnailUrl?: string;
  status?: string;
}

export interface UserDetailView extends UserSimpleView {
  representativePost: PostSimpleView;
  // TODO: add more
}

export interface UserAuthorizedView extends UserDetailView {
  login: string;
}

import { CountEstimationView, Id } from "@this-project/common-api-common";
import { UserSimpleView } from "../uesrs/types";

export type PostId = Id<"post">;

export interface PostSimpleView {
  id: PostId;
  title: string;
  viewCount: CountEstimationView;
  commentCount: number;
  author: UserSimpleView;
}

export interface PostDetailView extends PostSimpleView {
  contentMarkdown: string;
}

import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { DocumentHistory } from "../document/DocumentHistory";
import {
  DocumentHistoryId,
  OperationId,
  OperationModifyId,
  PostId,
} from "../IdTypes";
import { Post } from "../post/Post";
import { Operation } from "./Operation";

export type OperationModify = Ensure<
  {
    name: "operationModify";
    scalars: {
      id: OperationModifyId;
      parentId: OperationId;
      postId: PostId;
      historyId?: DocumentHistoryId;
      contentDiff?: string;
    };
    objects: {
      parent: Operation;
      post: Post;
      history?: DocumentHistory;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

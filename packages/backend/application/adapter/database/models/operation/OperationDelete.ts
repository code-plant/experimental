import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { OperationDeleteId, OperationId, PostId } from "../IdTypes";
import { Post } from "../post/Post";
import { Operation } from "./Operation";

export type OperationDelete = Ensure<
  {
    name: "operationDelete";
    scalars: {
      id: OperationDeleteId;
      parentId: OperationId;
      postId: PostId;
    };
    objects: {
      parent: Operation;
      post: Post;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

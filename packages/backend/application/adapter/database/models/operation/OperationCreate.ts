import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { OperationCreateId, OperationId, PostId } from "../IdTypes";
import { Post } from "../post/Post";
import { Operation } from "./Operation";

export type OperationCreate = Ensure<
  {
    name: "operationCreate";
    scalars: {
      id: OperationCreateId;
      parentId: OperationId;
      postId?: PostId;
    };
    objects: {
      parent: Operation;
      post?: Post;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

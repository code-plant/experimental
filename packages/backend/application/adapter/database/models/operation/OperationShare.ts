import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { Entity } from "../entity/Entity";
import {
  EntityId,
  OperationId,
  OperationShareId,
  PostId,
  ShareId,
} from "../IdTypes";
import { Post } from "../post/Post";
import { Share } from "../post/Share";
import { Operation } from "./Operation";

export type OperationShare = Ensure<
  {
    name: "operationShare";
    scalars: {
      id: OperationShareId;
      parentId: OperationId;
      postId: PostId;
      toEntityId: EntityId;
      expiresAt?: Date;
      shareId?: ShareId;
    };
    objects: {
      parent: Operation;
      post: Post;
      toEntity: Entity;
      share?: Share;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

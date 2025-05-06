import { Ensure } from "@this-project/util-types-common";
import { ModelBase } from "../../base/ModelBase";
import { EntityId, PostId, ShareId } from "../IdTypes";
import { Entity } from "../entity/Entity";
import { Post } from "./Post";

export type Share = Ensure<
  {
    name: "share";
    scalars: {
      id: ShareId;
      createdAt: Date;
      updatedAt: Date;
      revokedAt?: Date;
      expiresAt?: Date;
      postId: PostId;
      entityId?: EntityId;
    };
    objects: {
      post: Post;
      entity?: Entity;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

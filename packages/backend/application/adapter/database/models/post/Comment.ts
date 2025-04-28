import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { Document } from "../document/Document";
import { Entity } from "../entity/Entity";
import { CommentId, DocumentId, EntityId, PostId } from "../IdTypes";
import { Post } from "./Post";

export type Comment = Ensure<
  {
    name: "comment";
    scalars: {
      id: CommentId;
      createdAt: Date;
      updatedAt: Date;
      resolvedAt?: Date;
      postId: PostId;
      documentId: DocumentId;
      authorId: EntityId;
    };
    objects: {
      post: Post;
      document: Document;
      author: Entity;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

import { Ensure } from "@this-project/util-types-common";
import { ModelBase } from "../../base/ModelBase";
import { DocumentId, EntityId, PostId } from "../IdTypes";
import { Document } from "../document/Document";
import { Entity } from "../entity/Entity";

export type Post = Ensure<
  {
    name: "post";
    scalars: {
      id: PostId;
      createdAt: Date;
      updatedAt: Date;
      title: string;
      documentId: DocumentId;
      authorId: EntityId;
    };
    objects: {
      document: Document;
      author: Entity;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

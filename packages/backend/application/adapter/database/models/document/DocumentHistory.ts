import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { Entity } from "../entity/Entity";
import { DocumentHistoryId, EntityId } from "../IdTypes";
import { Document } from "./Document";
import { DocumentSnapshot } from "./DocumentSnapshot";

export type DocumentHistory = Ensure<
  {
    name: "documentHistory";
    scalars: {
      id: DocumentHistoryId;
      createdAt: Date;
      authorId: EntityId;
      diff: string;
    };
    objects: {
      document: Document;
      author: Entity;
      snapshot?: DocumentSnapshot;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

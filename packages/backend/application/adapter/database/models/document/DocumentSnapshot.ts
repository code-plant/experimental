import { Ensure } from "@this-project/util-types-common";
import { ModelBase } from "../../base/ModelBase";
import { DocumentHistoryId, DocumentId, DocumentSnapshotId } from "../IdTypes";
import { Document } from "./Document";
import { DocumentHistory } from "./DocumentHistory";

export type DocumentSnapshot = Ensure<
  {
    name: "documentSnapshot";
    scalars: {
      id: DocumentSnapshotId;
      createdAt: Date;
      updatedAt: Date;
      documentId: DocumentId;
      historyId: DocumentHistoryId;
      contentMdcode: string;
    };
    objects: {
      document: Document;
      history: DocumentHistory;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

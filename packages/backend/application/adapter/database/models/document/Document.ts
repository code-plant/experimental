import { Ensure } from "@this-project/util-types-common";
import { ModelBase } from "../../base/ModelBase";
import { DocumentId } from "../IdTypes";
import { User } from "../base/User";
import { DocumentAttachment } from "./DocumentAttachment";
import { DocumentHistory } from "./DocumentHistory";
import { DocumentSnapshot } from "./DocumentSnapshot";

export type Document = Ensure<
  {
    name: "document";
    scalars: {
      id: DocumentId;
      createdAt: Date;
      updatedAt: Date;
      title: string;
      latestContentSnapshotMdcode: string;
    };
    objects: {
      author: User;
      attachments: DocumentAttachment[];
      histories: DocumentHistory[];
      snapshots: DocumentSnapshot[];
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

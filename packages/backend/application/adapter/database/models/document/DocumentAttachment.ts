import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { File } from "../base/File";
import { DocumentAttachmentId, DocumentId, FileId } from "../IdTypes";
import { Document } from "./Document";

export type DocumentAttachment = Ensure<
  {
    name: "documentAttachment";
    scalars: {
      id: DocumentAttachmentId;
      createdAt: Date;
      updatedAt: Date;
      documentId: DocumentId;
      fileId: FileId;
    };
    objects: {
      document: Document;
      file: File;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

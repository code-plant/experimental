import { Ensure } from "@this-project/util-types-common";
import { ModelBase } from "../../base/ModelBase";
import { FileId } from "../IdTypes";

export type File = Ensure<
  {
    name: "file";
    scalars: {
      id: FileId;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      size: number;
      type: string;
      path: string;
    };
    objects: {};
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

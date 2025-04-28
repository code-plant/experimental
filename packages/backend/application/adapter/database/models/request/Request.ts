import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { OperationId, RequestId } from "../IdTypes";
import { Operation } from "../operation/Operation";
import { RequestItem } from "./RequestItem";
import { RequestStatus } from "./RequestStatus";

export type Request = Ensure<
  {
    name: "request";
    scalars: {
      id: RequestId;
      operationId: OperationId;
      createdAt: Date;
      updatedAt: Date;
      lastStatus: RequestStatus;
    };
    objects: {
      operation: Operation;
      items: RequestItem[];
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

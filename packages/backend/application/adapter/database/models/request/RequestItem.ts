import { Ensure } from "@this-project/util-types-common";
import { ModelBase } from "../../base/ModelBase";
import { EntityId, RequestId, RequestItemId } from "../IdTypes";
import { Entity } from "../entity/Entity";
import { Request } from "./Request";
import { RequestStatus } from "./RequestStatus";

export type RequestItem = Ensure<
  {
    name: "requestItem";
    scalars: {
      id: RequestItemId;
      requestId: RequestId;
      createdAt: Date;
      updatedAt: Date;
      step: number;
      entityId: EntityId;
      status: RequestStatus;
    };
    objects: {
      request: Request;
      entity: Entity;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

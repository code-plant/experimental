import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { EntityId, OperationId } from "../IdTypes";
import { Entity } from "../entity/Entity";
import { OperationCreate } from "./OperationCreate";
import { OperationDelete } from "./OperationDelete";
import { OperationModify } from "./OperationModify";
import { OperationShare } from "./OperationShare";

export type Operation = Ensure<
  {
    name: "operation";
    scalars: {
      id: OperationId;
      createdAt: Date;
      updatedAt: Date;
      entityId: EntityId;
      type: "create" | "modify" | "share" | "delete";
      executedAt?: Date;
    };
    objects: {
      entity: Entity;
      operationCreate?: OperationCreate;
      operationDelete?: OperationDelete;
      operationModify?: OperationModify;
      operationShare?: OperationShare;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

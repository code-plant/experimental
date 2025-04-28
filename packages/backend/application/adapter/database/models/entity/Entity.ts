import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { EntityId, GroupId } from "../IdTypes";
import { Group } from "./Group";

export type Entity = Ensure<
  {
    name: "entity";
    scalars: {
      id: EntityId;
      createdAt: Date;
      updatedAt: Date;
      groupId: GroupId;
      nickname: string;
      description: string;
    };
    objects: {
      group: Group;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

import { Ensure } from "@this-project/util-types-common";
import { ModelBase } from "../../base/ModelBase";
import { UserId } from "../IdTypes";
import { Entity } from "../entity/Entity";
import { Group } from "../entity/Group";
import { GroupMember } from "../entity/GroupMember";

export type User = Ensure<
  {
    name: "user";
    scalars: {
      id: UserId;
      login: string;
      passwordHash: string;
      createdAt: Date;
      updatedAt: Date;
    };
    objects: {
      ownedGroups: Group[];
      groups: GroupMember[];
      entities: Entity[];
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

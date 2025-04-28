import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { User } from "../base/User";
import { GroupId, UserId } from "../IdTypes";
import { Entity } from "./Entity";
import { GroupMember } from "./GroupMember";
import { GroupRole } from "./GroupRole";

export type Group = Ensure<
  {
    name: "group";
    scalars: {
      id: GroupId;
      createdAt: Date;
      updatedAt: Date;
      name: string;
      superOwnerId: UserId;
    };
    objects: {
      superOwner: User;
      roles: GroupRole[];
      members: GroupMember[];
      entities: Entity[];
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

import { Ensure } from "@this-project/util-types-common";
import { ModelBase } from "../../base/ModelBase";
import { User } from "../base/User";
import { GroupId, GroupMemberId, GroupRoleId, UserId } from "../IdTypes";
import { Group } from "./Group";
import { GroupRole } from "./GroupRole";

export type GroupMember = Ensure<
  {
    name: "groupMember";
    scalars: {
      id: GroupMemberId;
      createdAt: Date;
      updatedAt: Date;
      groupId: GroupId;
      roleId: GroupRoleId;
      userId: UserId;
    };
    objects: {
      group: Group;
      role: GroupRole;
      user: User;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

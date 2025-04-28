import { Ensure } from "@this-project/util-common-types";
import { ModelBase } from "../../base/ModelBase";
import { GroupId, GroupRoleId } from "../IdTypes";
import { Group } from "./Group";

export type GroupRole = Ensure<
  {
    name: "groupRole";
    scalars: {
      id: GroupRoleId;
      createdAt: Date;
      updatedAt: Date;
      groupId: GroupId;
      name: string;
    };
    objects: {
      group: Group;
    };
    uniqueIndices: [];
    indices: [];
  },
  ModelBase
>;

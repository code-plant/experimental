import { NodeBase } from "@this-project/editor-core-types";

export function is<T extends NodeBase>(
  value: NodeBase,
  type: T["type"]
): value is T {
  return value.type === type;
}

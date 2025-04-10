import { UnionToIntersection } from "./UnionToIntersection";

export type UnionAny<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends infer I
  ? I extends () => infer R
    ? R
    : never
  : never;

import { RemoveFirst } from "./RemoveFirst";

export type StringJoin<
  T extends string[],
  S extends string,
  A extends string = never
> = T["length"] extends 0
  ? [A] extends [never]
    ? ""
    : A
  : StringJoin<
      RemoveFirst<T>,
      S,
      [A] extends [never] ? T[0] : `${A}${S}${T[0]}`
    >;

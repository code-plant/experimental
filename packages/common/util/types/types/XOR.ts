import { RemoveFirst } from "./RemoveFirst";

export type XOR<T extends any[]> = XORInternal1<
  T,
  XORInternal2<T, never>,
  never
>;

type XORInternal2<T extends any[], R> = T["length"] extends 0
  ? R
  : XORInternal2<RemoveFirst<T>, keyof T[0] | R>;

type XORInternal1<
  T extends any[],
  K extends keyof any,
  R
> = T["length"] extends 0
  ? R
  : XORInternal1<
      RemoveFirst<T>,
      K,
      R | (Partial<Record<Exclude<K, keyof T[0]>, undefined>> & T[0])
    >;

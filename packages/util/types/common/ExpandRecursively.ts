export type ExpandRecursively<T> = T extends object
  ? T extends infer I
    ? { [K in keyof I]: ExpandRecursively<I[K]> }
    : never
  : T;

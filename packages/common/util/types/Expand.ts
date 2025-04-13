export type Expand<T> = T extends infer I ? { [K in keyof I]: I[K] } : never;

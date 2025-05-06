export type ExtractVariablesFromPath<T extends string> =
  ExtractVariablesFromPathInternal<T>;

type ExtractVariablesFromPathInternal<
  T extends string,
  R extends string = never
> = T extends `${string}/:${infer I extends string}/${infer U extends string}`
  ? ExtractVariablesFromPathInternal<`/${U}`, R | I>
  : T extends `${string}/:${infer I extends string}`
  ? R | I
  : R;

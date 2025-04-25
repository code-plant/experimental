import { UnionAny } from "./UnionAny";

type StringUnionToStringInternal<
  TUnion extends string,
  TSeparator extends string,
  TResult extends string | undefined
> = UnionAny<TUnion> extends infer I
  ? [I] extends [never]
    ? TResult
    : TResult extends undefined
    ? StringUnionToStringInternal<
        Exclude<TUnion, I>,
        TSeparator,
        I extends string ? I : "WTF"
      >
    : StringUnionToStringInternal<
        Exclude<TUnion, I>,
        TSeparator,
        `${Extract<I, string>}${TSeparator}${TResult}`
      >
  : never;

export type StringUnionToString<
  TUnion extends string,
  TSeparator extends string = ", "
> = StringUnionToStringInternal<TUnion, TSeparator, undefined>;

import { RemoveFirst, StringJoin, XOR } from "@this-project/util-types-common";

type Scalars<T> = T extends Record<"scalars", infer I> ? I : never;
type Objects<T> = T extends Record<"objects", infer I> ? I : never;
type UniqueIndices<T> = T extends Record<"uniqueIndices", infer I> ? I : never;

export type SelectInput<T> = Readonly<Partial<Record<keyof Scalars<T>, true>>> &
  IncludeInput<T>;
export type IncludeInput<T> = {
  readonly [K in keyof Objects<T>]?: GetInput<
    UnwrapArray<NonNullable<Objects<T>[K]>>
  >;
};
export type GetInput<T> =
  | { select: SelectInput<T> }
  | { include: IncludeInput<T> }
  | true;
type UnwrapArray<T> = T extends (infer I)[] ? I : T;

export type SelectResult<Model, Select extends SelectInput<Model>> = Pick<
  Scalars<Model>,
  Extract<keyof Scalars<Model>, keyof Select>
> &
  IncludeObjectResult<Model, Select>;
export type IncludeResult<
  Model,
  Include extends IncludeInput<Model>
> = Scalars<Model> & IncludeObjectResult<Model, Include>;
type IncludeObjectResult<Model, Include extends IncludeInput<Model>> = {
  [K in Extract<
    keyof Objects<Model>,
    keyof Include
  >]: Include[K] extends GetInput<UnwrapArray<NonNullable<Objects<Model>[K]>>>
    ? WrapNullable<
        WrapArray<
          GetResult<UnwrapArray<NonNullable<Objects<Model>[K]>>, Include[K]>,
          NonNullable<Objects<Model>[K]>
        >,
        Objects<Model>[K]
      >
    : never;
};
export type GetResult<Model, Get extends GetInput<Model>> = Get extends {
  select: infer I extends SelectInput<Model>;
}
  ? SelectResult<Model, I>
  : Get extends { include: infer I extends IncludeInput<Model> }
  ? IncludeResult<Model, I>
  : Scalars<Model>;
type WrapArray<Target, Original> = Original extends any[] ? Target[] : Target;
type WrapNullable<Target, Original> = Original extends NonNullable<Original>
  ? Target
  : Target | undefined;

export type UniqueWhere<Model> = XOR<
  UniqueWhereInternal<Model, Extract<UniqueIndices<Model>, any[]>, []>
>;
type UniqueWhereInternal<
  Model,
  Remaining extends any[],
  Processed extends any[]
> = Remaining["length"] extends 0
  ? Processed
  : UniqueWhereInternal<
      Model,
      RemoveFirst<Remaining>,
      [
        ...Processed,
        {
          [K in Extract<StringJoin<Remaining[0], "_">, string>]: {
            [K in Remaining[0][number]]: K extends keyof Scalars<Model>
              ? Scalars<Model>[K]
              : K extends keyof Objects<Model>
              ? UniqueWhere<Objects<Model>[K]>
              : "ERROR";
          };
        }
      ]
    >;

export type NonUniqueWhere<Model> = {
  [K in
    | keyof Scalars<Model>
    | keyof Objects<Model>
    | "AND"
    | "OR"
    | "NOT"]?: K extends "AND" | "OR"
    ? NonUniqueWhere<Model>[]
    : K extends "NOT"
    ? NonUniqueWhere<Model>
    : K extends keyof Scalars<Model>
    ? ScalarWhere<Scalars<Model>[K]>
    : K extends keyof Objects<Model>
    ? ObjectWhere<Objects<Model>[K]>
    : never;
};

export type ScalarWhere<T> = T extends string
  ? StringWhere
  : T extends Date
  ? DateWhere
  : T extends number
  ? NumberWhere
  : T extends number
  ? BooleanWhere
  : T extends string | undefined
  ? StringNullableWhere
  : T extends Date | undefined
  ? DateNullableWhere
  : T extends number | undefined
  ? NumberNullableWhere
  : T extends number | undefined
  ? BooleanNullableWhere
  : never;

export type StringWhere = XOR<[{ exact: string }, { startsWith: string }]>;

export type DateWhere = XOR<
  [{ exact: Date }, { lt: Date }, { gt: Date }, { lte: Date }, { gte: Date }]
>;

export type NumberWhere = XOR<
  [
    { exact: number },
    { lt: number },
    { gt: number },
    { lte: number },
    { gte: number }
  ]
>;

export type BooleanWhere = XOR<[{ exact: boolean }]>;

export type StringNullableWhere = XOR<
  [{ not: null }, { is: null }, { exact: string }, { startsWith: string }]
>;

export type DateNullableWhere = XOR<
  [
    { not: null },
    { is: null },
    { exact: Date },
    { lt: Date },
    { gt: Date },
    { lte: Date },
    { gte: Date }
  ]
>;

export type NumberNullableWhere = XOR<
  [
    { not: null },
    { is: null },
    { exact: number },
    { lt: number },
    { gt: number },
    { lte: number },
    { gte: number }
  ]
>;

export type BooleanNullableWhere = XOR<
  [{ not: null }, { is: null }, { exact: boolean }]
>;

export type ObjectWhere<Field> = Field extends (infer I)[]
  ? ObjectArrayWhere<I>
  : Field extends (infer I)[] | undefined
  ? NullableObjectArrayWhere<I>
  : undefined extends Field
  ? NullableSingleObjectWhere<Exclude<Field, undefined>>
  : SingleObjectWhere<Field>;

// TODO:
export type ObjectArrayWhere<Model> = XOR<[]>;
export type NullableObjectArrayWhere<Model> = XOR<[]>;
export type SingleObjectWhere<Model> = XOR<[]>;
export type NullableSingleObjectWhere<Model> = XOR<[]>;

// TODO: add client

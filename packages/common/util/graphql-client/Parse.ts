export type GraphQLValue =
  | GraphQLVariable
  | GraphQLNumberValue
  | string
  | boolean
  | null
  | GraphQLEnumValue
  | GraphQLListValue
  | GraphQLObjectValue;

export interface GraphQLVariable {
  type: "variable";
  name: string;
}

export interface GraphQLNumberValue {
  type: "number";
  name: string;
}

export interface GraphQLEnumValue {
  type: "enum";
  name: string;
}

export interface GraphQLListValue {
  type: "list";
  value: unknown[];
}

export interface GraphQLObjectValue {
  type: "object";
  value: object;
}

export type Parse<S extends string> = ParseInternal<TrimStart<S>, []>;

type ParseInternal<S extends string, R extends unknown[]> = S extends ""
  ? R
  : ExpectExecutableDefinition<S> extends [infer A, infer B extends string]
  ? string extends B // `never extends [infer A, infer B extend string] ? [A, B] : never` is [unknown, string]
    ? never
    : ParseInternal<TrimStart<B>, [...R, A]>
  : "never";

type Ignored = " " | "\t" | "\n" | ",";

type TrimStart<S extends string> = S extends `${Ignored}${infer I}`
  ? TrimStart<I>
  : S extends `#${string}\n${infer I}`
  ? TrimStart<I>
  : S;

type ExpectString<S extends string> = S extends `"""${infer I}`
  ? ExpectStringBlockInternal<I, "">
  : S extends `"${infer I}`
  ? ExpectStringInternal<I, "">
  : never;

type ExpectStringBlockInternal<
  S extends string,
  R extends string
> = S extends `${infer A}"""${infer B}`
  ? A extends `${infer C}\\`
    ? ExpectStringBlockInternal<B, `${R}${C}"""`>
    : [PostProcessBlockString<`${R}${A}`>, TrimStart<B>]
  : never;

type PostProcessBlockString<S extends string> =
  /* // TODO: https://spec.graphql.org/October2021/#BlockStringValue() */ S;

type ExpectStringInternal<
  S extends string,
  R extends string
> = S extends `${infer A}"${infer B}`
  ? A extends `${string}\\`
    ? ExpectStringInternal<B, `${R}${A}\\"`>
    : A extends `${string}\n${string}`
    ? never
    : [Unescape<`${R}${A}`>, TrimStart<B>]
  : never;

type Unescape<S extends string> = UnescapeInternal<S, "">;

type UnescapeMap = {
  '"': '"';
  "\\": "\\";
  "/": "/";
  b: "\b";
  f: "\f";
  n: "\n";
  r: "\r";
  t: "\t";
};

type UnescapeInternal<
  S extends string,
  R extends string
> = S extends `${infer A}\\${infer B}`
  ? B extends `${infer C extends keyof UnescapeMap}${infer D}`
    ? UnescapeInternal<D, `${R}${A}${UnescapeMap[C]}`>
    : B extends `u${infer C}`
    ? UnescapeInternal<C, `${R}${A}\\u`>
    : never
  : `${R}${S}`;

type NameStart = Letter | "_";
type NameContinue = Letter | Digit | "_";
type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "I"
  | "J"
  | "K"
  | "L"
  | "M"
  | "N"
  | "O"
  | "P"
  | "Q"
  | "R"
  | "S"
  | "T"
  | "U"
  | "V"
  | "W"
  | "X"
  | "Y"
  | "Z";
type Digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";

type ExpectName<S extends string> =
  S extends `${infer A extends NameStart}${infer B}`
    ? ExpectNameInternal<B, A>
    : never;

type ExpectNameInternal<
  S extends string,
  R extends string
> = S extends `${infer A extends NameContinue}${infer B}`
  ? ExpectNameInternal<B, `${R}${A}`>
  : [R, TrimStart<S>];

type ExpectExecutableDefinition<S extends string> = ExpectName<S> extends [
  "fragment",
  string
]
  ? ExpectFragment<S>
  : ExpectOperation<S>;

type ExpectFragment<S extends string> = ExpectName<S> extends [
  "fragment",
  infer A extends string
]
  ? ExpectName<A> extends [infer Name extends string, infer B extends string]
    ? string extends B
      ? never
      : ExpectName<B> extends ["on", infer C extends string]
      ? string extends C
        ? never
        : ExpectName<C> extends [
            infer TypeCondition extends string,
            infer D extends string
          ]
        ? string extends D
          ? never
          : SkipDirectives<D> extends infer E extends string
          ? string extends E
            ? never
            : TODO
          : never
        : never
      : never
    : never
  : never;

type SkipDirectives<S extends string> = S extends `@${infer A}`
  ? ExpectName<TrimStart<A>> extends [string, infer B extends string]
    ? string extends B
      ? never
      : B extends `(${string}`
      ? ExpectArguments<B> extends [unknown, infer C extends string]
        ? string extends C
          ? never
          : SkipDirectives<C>
        : never
      : B
    : never
  : S;

type ExpectArguments<S extends string> = S extends `(${infer A extends string}`
  ? ExpectArgument<A> extends [infer Argument, infer B extends string]
    ? string extends B
      ? never
      : ExpectArgumentsInternal<B, [Argument]>
    : never
  : never;

type ExpectArgumentsInternal<
  S extends string,
  R extends unknown[]
> = S extends `)${infer I}`
  ? [R, TrimStart<I>]
  : ExpectArgument<S> extends [infer Argument, infer A extends string]
  ? string extends A
    ? never
    : ExpectArgumentsInternal<A, [...R, Argument]>
  : never;

type ExpectArgument<S extends string> = ExpectName<S> extends [
  infer Name extends string,
  infer A extends string
]
  ? string extends A
    ? never
    : A extends `:${infer B}`
    ? ExpectValue<TrimStart<B>> extends [infer Value, infer C extends string]
      ? string extends C
        ? never
        : [[Name, Value], TrimStart<C>]
      : never
    : never
  : never;

type ExpectValue<S extends string> = S extends `${NameStart}${string}`
  ? ExpectVariable<S>
  : S extends `${"-" | Digit}${string}`
  ? ExpectNumber<S>
  : S extends `"${string}`
  ? ExpectString<S>
  : S extends `[${string}`
  ? ExpectListValue<S>
  : S extends `{${string}`
  ? ExpectObjectValue<S>
  : ExpectNameValue<S>;

type ExpectNameValue<S extends string> = ExpectName<S> extends [
  infer Name extends string,
  infer I extends string
]
  ? string extends I
    ? never
    : Name extends "true"
    ? [true, TrimStart<I>]
    : Name extends "false"
    ? [false, TrimStart<I>]
    : Name extends "null"
    ? [null, TrimStart<I>]
    : [{ type: "enum"; value: Name }, TrimStart<I>]
  : never;

type ExpectVariable<S extends string> = S extends `$${infer I}`
  ? ExpectName<TrimStart<I>> extends [
      infer Name extends string,
      infer I extends string
    ]
    ? string extends I
      ? never
      : [{ type: "variable"; name: Name }, TrimStart<I>]
    : never
  : never;

// TODO: return never on 0X, -0X where X is digit
type ExpectNumber<S extends string> = S extends `-${infer I}`
  ? ExpectNumberInternalDigit<I, "-">
  : ExpectNumberInternalDigit<S, "">;

type ExpectNumberInternalDigit<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? ExpectNumberInternalDigitOptional<B, `${R}${A}`>
  : never;

type ExpectNumberInternalDigitOptional<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? ExpectNumberInternalDigitOptional<B, `${R}${A}`>
  : S extends `.${infer A}`
  ? ExpectNumberInternalFractionalPart<A, `${R}.`>
  : S extends `${infer A extends "e" | "E"}${infer B}`
  ? ExpectNumberInternalExponentSignPart<B, `${R}${A}`>
  : S extends `${NameStart}${string}`
  ? never
  : [{ type: "number"; value: R }, TrimStart<S>];

type ExpectNumberInternalFractionalPart<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? ExpectNumberInternalFractionalPartOptional<B, `${R}${A}`>
  : never;

type ExpectNumberInternalFractionalPartOptional<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? ExpectNumberInternalFractionalPartOptional<B, `${R}${A}`>
  : S extends `${"e" | "E"}${infer A}`
  ? ExpectNumberInternalExponentSignPart<A, `${R}e`>
  : S extends `${NameStart}${string}`
  ? never
  : [{ type: "number"; value: R }, TrimStart<S>];

type ExpectNumberInternalExponentSignPart<
  S extends string,
  R extends string
> = S extends `${infer A extends "+" | "-"}${infer B}`
  ? ExpectNumberInternalExponentPart<B, `${R}${A}`>
  : S extends `${infer A extends Digit}${infer B}`
  ? ExpectNumberInternalExponentPartOptional<B, `${R}${A}`>
  : never;

type ExpectNumberInternalExponentPart<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? ExpectNumberInternalExponentPartOptional<B, `${R}${A}`>
  : never;

type ExpectNumberInternalExponentPartOptional<
  S extends string,
  R extends string
> = S extends `${infer A extends Digit}${infer B}`
  ? ExpectNumberInternalExponentPartOptional<B, `${R}${A}`>
  : S extends `${NameStart}${string}`
  ? never
  : [{ type: "number"; value: R }, TrimStart<S>];

type ExpectListValue<S extends string> = S extends `[${infer I}`
  ? ExpectListValueInternal<TrimStart<I>, []>
  : never;

type ExpectListValueInternal<
  S extends string,
  R extends unknown[]
> = S extends `]${infer I}`
  ? [R, TrimStart<I>]
  : ExpectValue<S> extends [infer A, infer B extends string]
  ? string extends B
    ? never
    : ExpectListValueInternal<B, [...R, A]>
  : never;

type ExpectObjectValue<S extends string> = S extends `{${infer I}`
  ? ExpectObjectValueInternal<TrimStart<I>, {}>
  : never;

type ExpectObjectValueInternal<
  S extends string,
  R extends object
> = S extends `}${infer I}`
  ? [R, TrimStart<I>]
  : ExpectName<S> extends [infer Key extends string, infer A extends string]
  ? string extends A
    ? never
    : A extends `:${infer B}`
    ? ExpectValue<TrimStart<B>> extends [infer Value, infer C extends string]
      ? string extends C
        ? never
        : Key extends keyof R
        ? never
        : ExpectObjectValueInternal<
            C,
            { [K in Key | keyof R]: K extends keyof R ? R[K] : Value }
          >
      : never
    : never
  : never;

type ExpectOperation<S extends string> = never; // TODO;

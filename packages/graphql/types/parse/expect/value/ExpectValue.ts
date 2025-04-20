import { Digit } from "../../internal-types";
import { ExpectListValue } from "./ExpectListValue";
import { ExpectNameValue } from "./ExpectNameValue";
import { ExpectNumberValue } from "./ExpectNumberValue";
import { ExpectObjectValue } from "./ExpectObjectValue";
import { ExpectStringValue } from "./ExpectStringValue";
import { ExpectVariable } from "./ExpectVariable";

export type ExpectValue<
  S extends string,
  On extends string
> = S extends `$${string}`
  ? ExpectVariable<S, On>
  : S extends `${"-" | Digit}${string}`
  ? ExpectNumberValue<S, On>
  : S extends `"${string}`
  ? ExpectStringValue<S, On>
  : S extends `[${string}`
  ? ExpectListValue<S, On>
  : S extends `{${string}`
  ? ExpectObjectValue<S, On>
  : ExpectNameValue<S, On>;

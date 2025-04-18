import { Digit } from "../../internal-types";
import { ExpectListValue } from "./ExpectListValue";
import { ExpectNameValue } from "./ExpectNameValue";
import { ExpectNumberValue } from "./ExpectNumberValue";
import { ExpectObjectValue } from "./ExpectObjectValue";
import { ExpectString } from "./ExpectString";
import { ExpectVariable } from "./ExpectVariable";

export type ExpectValue<S extends string> = S extends `$${string}`
  ? ExpectVariable<S>
  : S extends `${"-" | Digit}${string}`
  ? ExpectNumberValue<S>
  : S extends `"${string}`
  ? ExpectString<S>
  : S extends `[${string}`
  ? ExpectListValue<S>
  : S extends `{${string}`
  ? ExpectObjectValue<S>
  : ExpectNameValue<S>;

import { Ensure } from "@this-project/common-util-types";
import { ExpectResultOk, TrimStart } from "../../internal-types";
import { Value } from "../../types";
import { ExpectName } from "../ExpectName";

export type ExpectNameValue<S extends string, On extends string> = ExpectName<
  S,
  On
> extends infer I
  ? I extends {
      type: "ok";
      value: infer Name extends string;
      rest: infer I extends string;
    }
    ? Ensure<
        Name extends "true"
          ? {
              type: "ok";
              value: { type: "boolean"; value: true };
              rest: TrimStart<I>;
            }
          : Name extends "false"
          ? {
              type: "ok";
              value: { type: "boolean"; value: false };
              rest: TrimStart<I>;
            }
          : Name extends "null"
          ? { type: "ok"; value: { type: "null" }; rest: TrimStart<I> }
          : {
              type: "ok";
              value: { type: "enum"; value: Name };
              rest: TrimStart<I>;
            },
        ExpectResultOk<Value>
      >
    : I
  : never;

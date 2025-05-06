import { Ensure } from "@this-project/util-types-common";
import { ExpectResultError, ExpectResultOk } from "../../internal-types";
import { StringValue } from "../../types";
import { ExpectString } from "../ExpectString";

export type ExpectStringValue<
  S extends string,
  On extends string
> = S extends `"${string}`
  ? ExpectString<S, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Value extends string;
        rest: infer Rest extends string;
      }
      ? Ensure<
          {
            type: "ok";
            value: {
              type: "string";
              value: Value;
            };
            rest: Rest;
          },
          ExpectResultOk<StringValue>
        >
      : I
    : never
  : Ensure<
      { type: "error"; error: "Expected string"; on: On },
      ExpectResultError
    >;

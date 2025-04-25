import { Ensure } from "@this-project/util-common-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../internal-types";
import { Variable } from "../../types";
import { ExpectName } from "../ExpectName";

export type ExpectVariable<
  S extends string,
  On extends string
> = S extends `$${infer I}`
  ? ExpectName<TrimStart<I>, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer I extends string;
      }
      ? Ensure<
          {
            type: "ok";
            value: { type: "variable"; name: Name };
            rest: TrimStart<I>;
          },
          ExpectResultOk<Variable>
        >
      : I
    : never
  : Ensure<
      { type: "error"; error: "Expected variable"; on: On },
      ExpectResultError
    >;

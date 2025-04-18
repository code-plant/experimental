import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../internal-types";
import { Variable } from "../../types";
import { ExpectName } from "../ExpectName";

export type ExpectVariable<S extends string> = S extends `$${infer I}`
  ? ExpectName<TrimStart<I>> extends infer I
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
  : Ensure<{ type: "error"; error: "Expected variable" }, ExpectResultError>;

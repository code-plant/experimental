import { Ensure } from "@this-project/common-util-types";
import { ExpectResultOk, TrimStart } from "../internal-types";
import { Argument, Directive } from "../types";
import { ExpectArguments } from "./ExpectArguments";
import { ExpectName } from "./ExpectName";

export type ExpectDirectives<S extends string> = Internal<S, []>;

type Internal<S extends string, R extends Directive[]> = S extends `@${infer A}`
  ? ExpectName<TrimStart<A>> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? B extends `(${string}`
        ? ExpectArguments<B> extends infer I
          ? I extends {
              type: "ok";
              value: infer Arguments extends Argument[];
              rest: infer C extends string;
            }
            ? Internal<C, [...R, { name: Name; arguments: Arguments }]>
            : I
          : never
        : Internal<TrimStart<B>, [...R, { name: Name; arguments: [] }]>
      : I
    : never
  : Ensure<{ type: "ok"; value: R; rest: S }, ExpectResultOk<Directive[]>>;

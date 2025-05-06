import { Ensure } from "@this-project/util-types-common";
import { ExpectResultOk, TrimStart } from "../internal-types";
import { Argument, Directive } from "../types";
import { ExpectArguments } from "./ExpectArguments";
import { ExpectName } from "./ExpectName";

export type ExpectDirectives<S extends string, On extends string> = Internal<
  S,
  [],
  On
>;

type Internal<
  S extends string,
  R extends Directive[],
  On extends string
> = S extends `@${infer A}`
  ? ExpectName<TrimStart<A>, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? B extends `(${string}`
        ? ExpectArguments<B, `${On} - directive arguments`> extends infer I
          ? I extends {
              type: "ok";
              value: infer Arguments extends Argument[];
              rest: infer C extends string;
            }
            ? Internal<C, [...R, { name: Name; arguments: Arguments }], On>
            : I
          : never
        : Internal<TrimStart<B>, [...R, { name: Name; arguments: [] }], On>
      : I
    : never
  : Ensure<{ type: "ok"; value: R; rest: S }, ExpectResultOk<Directive[]>>;

import { Ensure } from "@this-project/util-types-common";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../internal-types";
import { Type } from "../types";
import { ExpectName } from "./ExpectName";

export type ExpectType<
  S extends string,
  On extends string
> = S extends `[${infer A}`
  ? ExpectType<TrimStart<A>, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer T extends Type;
        rest: infer B extends string;
      }
      ? B extends `]${infer C}`
        ? TrimStart<C> extends `!${infer D}`
          ? Ensure<
              {
                type: "ok";
                value: {
                  type: "nonNull";
                  element: {
                    type: "list";
                    element: T;
                  };
                };
                rest: TrimStart<D>;
              },
              ExpectResultOk<Type>
            >
          : Ensure<
              {
                type: "ok";
                value: {
                  type: "list";
                  element: T;
                };
                rest: TrimStart<C>;
              },
              ExpectResultOk<Type>
            >
        : Ensure<
            { type: "error"; error: "Expected ]"; on: On },
            ExpectResultError
          >
      : I
    : never
  : ExpectName<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer T extends string;
      rest: infer A extends string;
    }
    ? A extends `!${infer B}`
      ? Ensure<
          {
            type: "ok";
            value: { type: "nonNull"; element: { type: "named"; name: T } };
            rest: TrimStart<B>;
          },
          ExpectResultOk<Type>
        >
      : Ensure<
          { type: "ok"; value: { type: "named"; name: T }; rest: A },
          ExpectResultOk<Type>
        >
    : I
  : never;

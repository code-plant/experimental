import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../internal-types";
import { Directive, FragmentDefinition, SelectionSet } from "../../../types";
import { ExpectDirectives } from "../../ExpectDirectives";
import { ExpectName } from "../../ExpectName";
import { ExpectSelectionSet } from "./ExpectSelectionSet";

export type ExpectFragmentDefinition<S extends string> = ExpectName<S> extends {
  type: "ok";
  value: "fragment";
  rest: infer A extends string;
}
  ? ExpectName<A> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? Name extends "on"
        ? Ensure<
            { type: "error"; error: "Fragment name cannot be on" },
            ExpectResultError
          >
        : ExpectName<B> extends {
            type: "ok";
            value: "on";
            rest: infer C extends string;
          }
        ? ExpectName<C> extends infer I
          ? I extends {
              type: "ok";
              value: infer TypeCondition extends string;
              rest: infer D extends string;
            }
            ? ExpectDirectives<D> extends infer I
              ? I extends {
                  type: "ok";
                  value: infer Dir extends Directive[];
                  rest: infer E extends string;
                }
                ? ExpectSelectionSet<E> extends infer I
                  ? I extends {
                      type: "ok";
                      value: infer Sel extends SelectionSet;
                      rest: infer F extends string;
                    }
                    ? Ensure<
                        {
                          type: "ok";
                          value: {
                            type: "executable";
                            subType: "fragment";
                            name: Name;
                            typeCondition: TypeCondition;
                            directives: Dir;
                            selectionSet: Sel;
                          };
                          rest: TrimStart<F>;
                        },
                        ExpectResultOk<FragmentDefinition>
                      >
                    : I
                  : never
                : I
              : never
            : I
          : never
        : Ensure<
            { type: "error"; error: "Expected keyword on" },
            ExpectResultError
          >
      : I
    : never
  : Ensure<
      { type: "error"; error: "Expected keyword fragment" },
      ExpectResultError
    >;

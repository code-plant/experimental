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

export type ExpectFragmentDefinition<S extends string> = ExpectName<
  S,
  "top level - fragment definition"
> extends {
  type: "ok";
  value: "fragment";
  rest: infer A extends string;
}
  ? ExpectName<A, "top level - fragment definition"> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? Name extends "on"
        ? Ensure<
            {
              type: "error";
              error: "Fragment name cannot be on";
              on: "top level - fragment definition";
            },
            ExpectResultError
          >
        : ExpectName<B, `fragment ${Name}`> extends {
            type: "ok";
            value: "on";
            rest: infer C extends string;
          }
        ? ExpectName<C, `fragment ${Name} - type condition`> extends infer I
          ? I extends {
              type: "ok";
              value: infer TypeCondition extends string;
              rest: infer D extends string;
            }
            ? ExpectDirectives<
                D,
                `fragment ${Name} - directives`
              > extends infer I
              ? I extends {
                  type: "ok";
                  value: infer Dir extends Directive[];
                  rest: infer E extends string;
                }
                ? ExpectSelectionSet<E, `fragment ${Name}`> extends infer I
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
            {
              type: "error";
              error: "Expected keyword on";
              on: `fragment ${Name} - type condition`;
            },
            ExpectResultError
          >
      : I
    : never
  : Ensure<
      {
        type: "error";
        error: "Expected keyword fragment";
        on: "top level - fragment definition";
      },
      ExpectResultError
    >;

import { Ensure } from "@this-project/util-types-common";
import {
  ExpectResultError,
  ExpectResultOk,
  NameStart,
  TrimStart,
} from "../../../internal-types";
import {
  Argument,
  Directive,
  Field,
  FragmentSpread,
  InlineFragment,
  Selection,
  SelectionSet,
} from "../../../types";
import { ExpectArguments } from "../../ExpectArguments";
import { ExpectDirectives } from "../../ExpectDirectives";
import { ExpectName } from "../../ExpectName";

export type ExpectSelectionSet<
  S extends string,
  On extends string
> = S extends `{${infer A}`
  ? ExpectSelection<TrimStart<A>, On> extends infer I
    ? I extends {
        type: "ok";
        value: infer Sel extends Selection;
        rest: infer B extends string;
      }
      ? Internal<B, [Sel], On>
      : I
    : never
  : Ensure<{ type: "error"; error: "Expected {"; on: On }, ExpectResultError>;

type Internal<
  S extends string,
  R extends Selection[],
  On extends string
> = S extends `}${infer I}`
  ? Ensure<
      { type: "ok"; value: R; rest: TrimStart<I> },
      ExpectResultOk<SelectionSet>
    >
  : ExpectSelection<S, On> extends infer I
  ? I extends {
      type: "ok";
      value: infer Sel extends Selection;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Sel], On>
    : I
  : never;

type ExpectSelection<
  S extends string,
  On extends string
> = S extends `${NameStart}${string}`
  ? ExpectField<S, On>
  : ExpectFragmentSpreadOrInlineFragment<S, On>;

type ExpectField<S extends string, On extends string> = ExpectName<
  S,
  On
> extends infer I
  ? I extends {
      type: "ok";
      value: infer NameOrAlias extends string;
      rest: infer A extends string;
    }
    ? A extends `:${infer B}`
      ? ExpectName<TrimStart<B>, `${On} - ${NameOrAlias} name`> extends infer I
        ? I extends {
            type: "ok";
            value: infer Name extends string;
            rest: infer B extends string;
          }
          ? ExpectFieldArguments<B, Name, NameOrAlias, On>
          : I
        : never
      : ExpectFieldArguments<A, NameOrAlias, undefined, On>
    : I
  : never;

type ExpectFieldArguments<
  S extends string,
  Name extends string,
  Alias extends string | undefined,
  On extends string
> = S extends `(${string}`
  ? ExpectArguments<S, `${On} - ${Alias} arguments`> extends infer I
    ? I extends {
        type: "ok";
        value: infer Arguments extends Argument[];
        rest: infer A extends string;
      }
      ? ExpectFieldDirectives<A, Name, Alias, Arguments, On>
      : I
    : never
  : ExpectFieldDirectives<S, Name, Alias, [], On>;

type ExpectFieldDirectives<
  S extends string,
  Name extends string,
  Alias extends string | undefined,
  Arguments extends Argument[],
  On extends string
> = ExpectDirectives<S, `${On} - ${Alias} directives`> extends infer I
  ? I extends {
      type: "ok";
      value: infer Dir extends Directive[];
      rest: infer A extends string;
    }
    ? ExpectFieldSelectionSet<A, Name, Alias, Arguments, Dir, On>
    : I
  : never;

type ExpectFieldSelectionSet<
  S extends string,
  Name extends string,
  Alias extends string | undefined,
  Arguments extends Argument[],
  Dir extends Directive[],
  On extends string
> = S extends `{${string}`
  ? ExpectSelectionSet<S, `${On} - ${Alias} selection set`> extends infer I
    ? I extends {
        type: "ok";
        value: infer Sel extends SelectionSet;
        rest: infer A extends string;
      }
      ? {
          type: "ok";
          value: {
            type: "field";
            name: Name;
            alias: Alias;
            arguments: Arguments;
            directives: Dir;
            selectionSet: Sel;
          };
          rest: TrimStart<A>;
        }
      : I
    : never
  : Ensure<
      {
        type: "ok";
        value: {
          type: "field";
          name: Name;
          alias: Alias;
          arguments: Arguments;
          directives: Dir;
          selectionSet: undefined;
        };
        rest: S;
      },
      ExpectResultOk<Field>
    >;

type ExpectFragmentSpreadOrInlineFragment<
  S extends string,
  On extends string
> = S extends `...${infer A}`
  ? ExpectName<
      TrimStart<A>,
      `${On} - fragment spread or inline fragment`
    > extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? Name extends "on"
        ? ExpectInlineFragmentTypeCondition<B, On>
        : ExpectFragmentSpread<B, Name, On>
      : ExpectInlineFragmentDirectives<TrimStart<A>, undefined, On>
    : never
  : Ensure<
      { type: "error"; error: "Expected field or ..."; on: On },
      ExpectResultError
    >;

type ExpectInlineFragmentTypeCondition<
  S extends string,
  On extends string
> = ExpectName<S, `${On} - inline fragment type condition`> extends infer I
  ? I extends {
      type: "ok";
      value: infer TypeCondition extends string;
      rest: infer A extends string;
    }
    ? ExpectInlineFragmentDirectives<A, TypeCondition, On>
    : I
  : never;

type ExpectInlineFragmentDirectives<
  A extends string,
  TypeCondition extends string | undefined,
  On extends string
> = ExpectDirectives<A, `${On} - inline fragment directives`> extends infer I
  ? I extends {
      type: "ok";
      value: infer Dir extends Directive[];
      rest: infer B extends string;
    }
    ? ExpectSelectionSet<
        B,
        `${On} - inline fragment selection set`
      > extends infer I
      ? I extends {
          type: "ok";
          value: infer Sel extends SelectionSet;
          rest: infer C extends string;
        }
        ? Ensure<
            {
              type: "ok";
              value: {
                type: "inlineFragment";
                typeCondition: TypeCondition;
                directives: Dir;
                selectionSet: Sel;
              };
              rest: C;
            },
            ExpectResultOk<InlineFragment>
          >
        : I
      : never
    : I
  : never;

type ExpectFragmentSpread<
  S extends string,
  Name extends string,
  On extends string
> = ExpectDirectives<S, `${On} - fragment spread directives`> extends infer I
  ? I extends {
      type: "ok";
      value: infer Dir extends Directive[];
      rest: infer A extends string;
    }
    ? Ensure<
        {
          type: "ok";
          value: {
            type: "fragmentSpread";
            name: Name;
            directives: Dir;
          };
          rest: TrimStart<A>;
        },
        ExpectResultOk<FragmentSpread>
      >
    : I
  : never;

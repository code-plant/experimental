import { Ensure } from "@this-project/common-util-types";
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

export type ExpectSelectionSet<S extends string> = S extends `{${infer A}`
  ? ExpectSelection<TrimStart<A>> extends infer I
    ? I extends {
        type: "ok";
        value: infer Sel extends Selection;
        rest: infer B extends string;
      }
      ? Internal<B, [Sel]>
      : I
    : never
  : Ensure<{ type: "error"; error: "Expected {" }, ExpectResultError>;

type Internal<S extends string, R extends Selection[]> = S extends `}${infer I}`
  ? Ensure<
      { type: "ok"; value: R; rest: TrimStart<I> },
      ExpectResultOk<SelectionSet>
    >
  : ExpectSelection<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Sel extends Selection;
      rest: infer A extends string;
    }
    ? Internal<A, [...R, Sel]>
    : I
  : never;

type ExpectSelection<S extends string> = S extends `${NameStart}${string}`
  ? ExpectField<S>
  : ExpectFragmentSpreadOrInlineFragment<S>;

type ExpectField<S extends string> = ExpectName<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer NameOrAlias extends string;
      rest: infer A extends string;
    }
    ? A extends `:${infer B}`
      ? ExpectName<TrimStart<B>> extends infer I
        ? I extends {
            type: "ok";
            value: infer Name extends string;
            rest: infer B extends string;
          }
          ? ExpectFieldArguments<B, Name, NameOrAlias>
          : I
        : never
      : ExpectFieldArguments<A, NameOrAlias, undefined>
    : I
  : never;

type ExpectFieldArguments<
  S extends string,
  Name extends string,
  Alias extends string | undefined
> = S extends `(${string}`
  ? ExpectArguments<S> extends infer I
    ? I extends {
        type: "ok";
        value: infer Arguments extends Argument[];
        rest: infer A extends string;
      }
      ? ExpectFieldDirectives<A, Name, Alias, Arguments>
      : I
    : never
  : ExpectFieldDirectives<S, Name, Alias, []>;

type ExpectFieldDirectives<
  S extends string,
  Name extends string,
  Alias extends string | undefined,
  Arguments extends Argument[]
> = ExpectDirectives<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer Dir extends Directive[];
      rest: infer A extends string;
    }
    ? ExpectFieldSelectionSet<A, Name, Alias, Arguments, Dir>
    : I
  : never;

type ExpectFieldSelectionSet<
  S extends string,
  Name extends string,
  Alias extends string | undefined,
  Arguments extends Argument[],
  Dir extends Directive[]
> = S extends `{${string}`
  ? ExpectSelectionSet<S> extends infer I
    ? I extends {
        type: "ok";
        value: infer Sel extends SelectionSet;
        rest: infer A extends string;
      }
      ? [
          {
            type: "field";
            name: Name;
            alias: Alias;
            arguments: Arguments;
            directives: Dir;
            selectionSet: Sel;
          },
          TrimStart<A>
        ]
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

type ExpectFragmentSpreadOrInlineFragment<S extends string> =
  S extends `...${infer A}`
    ? ExpectName<TrimStart<A>> extends infer I
      ? I extends {
          type: "ok";
          value: infer Name extends string;
          rest: infer B extends string;
        }
        ? Name extends "on"
          ? ExpectInlineFragmentTypeCondition<B>
          : ExpectFragmentSpread<B, Name>
        : ExpectInlineFragmentDirectives<TrimStart<A>, undefined>
      : never
    : Ensure<
        { type: "error"; error: "Expected field or ..." },
        ExpectResultError
      >;

type ExpectInlineFragmentTypeCondition<S extends string> =
  ExpectName<S> extends infer I
    ? I extends {
        type: "ok";
        value: infer TypeCondition extends string;
        rest: infer A extends string;
      }
      ? ExpectInlineFragmentDirectives<A, TypeCondition>
      : I
    : never;

type ExpectInlineFragmentDirectives<
  A extends string,
  TypeCondition extends string | undefined
> = ExpectDirectives<A> extends infer I
  ? I extends {
      type: "ok";
      value: infer Dir extends Directive[];
      rest: infer B extends string;
    }
    ? ExpectSelectionSet<B> extends infer I
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
  Name extends string
> = ExpectDirectives<S> extends infer I
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

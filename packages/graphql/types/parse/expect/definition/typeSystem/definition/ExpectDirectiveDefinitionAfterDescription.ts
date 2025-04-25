import { Ensure } from "@this-project/util-common-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../../internal-types";
import {
  ArgumentsDefinition,
  DirectiveDefinition,
  DirectiveLocation,
} from "../../../../types";
import { ExpectName } from "../../../ExpectName";
import { ExpectArgumentsDefinition } from "../ExpectArgumentsDefinition";

export type ExpectDirectiveDefinitionAfterDescription<
  S extends string,
  Description extends string | undefined
> = ExpectName<S, "top level - directive definition"> extends {
  type: "ok";
  value: "directive";
  rest: infer A extends string;
}
  ? A extends `@${infer B}`
    ? ExpectName<
        TrimStart<B>,
        "top level - directive definition"
      > extends infer I
      ? I extends {
          type: "ok";
          value: infer Name extends string;
          rest: infer C extends string;
        }
        ? C extends `(${string}`
          ? ExpectArgumentsDefinition<C, `@${Name} - arguments`> extends infer I
            ? I extends {
                type: "ok";
                value: infer Arguments extends ArgumentsDefinition;
                rest: infer D extends string;
              }
              ? AfterArguments<D, Description, Name, Arguments>
              : I
            : never
          : AfterArguments<C, Description, Name, []>
        : I
      : never
    : Ensure<
        {
          type: "error";
          error: "Expected @";
          on: "top level - directive definition";
        },
        ExpectResultError
      >
  : Ensure<
      {
        type: "error";
        error: "Expected keyword directive";
        on: "top level - directive definition";
      },
      ExpectResultError
    >;

type AfterArguments<
  S extends string,
  Description extends string | undefined,
  Name extends string,
  Arguments extends ArgumentsDefinition
> = ExpectName<S, `@${Name} - repeatable`> extends {
  type: "ok";
  value: "repeatable";
  rest: infer R extends string;
}
  ? AfterRepeatable<R, Description, Name, Arguments, true>
  : AfterRepeatable<S, Description, Name, Arguments, false>;

type AfterRepeatable<
  S extends string,
  Description extends string | undefined,
  Name extends string,
  Arguments extends ArgumentsDefinition,
  Repeatable extends boolean
> = ExpectName<S, `@${Name} - on`> extends {
  type: "ok";
  value: "on";
  rest: infer A extends string;
}
  ? A extends `|${string}`
    ? Internal<S, Description, Name, Arguments, Repeatable, []>
    : ExpectName<A, `@${Name} - location`> extends {
        type: "ok";
        value: infer Location extends DirectiveLocation;
        rest: infer B extends string;
      }
    ? Internal<B, Description, Name, Arguments, Repeatable, [Location]>
    : Ensure<
        {
          type: "error";
          error: "Expected DirectiveLocation";
          on: `@${Name} - location`;
        },
        ExpectResultError
      >
  : Ensure<
      { type: "error"; error: "Expected keyword on"; on: `@${Name} - on` },
      ExpectResultError
    >;

type Internal<
  S extends string,
  Description extends string | undefined,
  Name extends string,
  Arguments extends ArgumentsDefinition,
  Repeatable extends boolean,
  Locations extends DirectiveLocation[]
> = S extends `|${infer A}`
  ? ExpectName<TrimStart<A>, `@${Name} - location`> extends {
      type: "ok";
      value: infer Location extends DirectiveLocation;
      rest: infer B extends string;
    }
    ? Internal<
        B,
        Description,
        Name,
        Arguments,
        Repeatable,
        [...Locations, Location]
      >
    : Ensure<
        {
          type: "error";
          error: "Expected DirectiveLocation";
          on: `@${Name} - location`;
        },
        ExpectResultError
      >
  : Ensure<
      {
        type: "ok";
        value: {
          type: "typeSystem";
          subType: "definition";
          definitionType: "directive";
          description: Description;
          name: Name;
          argumentsDefinition: Arguments;
          repeatable: Repeatable;
          directiveLocations: Locations;
        };
        rest: S;
      },
      ExpectResultOk<DirectiveDefinition>
    >;

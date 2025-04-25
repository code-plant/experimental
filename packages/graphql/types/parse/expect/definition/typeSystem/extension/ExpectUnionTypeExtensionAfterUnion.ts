import { Ensure } from "@this-project/util-common-types";
import { ExpectResultError, ExpectResultOk } from "../../../../internal-types";

import { TrimStart } from "../../../../internal-types";
import { Directives, UnionTypeExtension } from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";

export type ExpectUnionTypeExtensionAfterUnion<S extends string> = ExpectName<
  S,
  "top level - union extension"
> extends infer I
  ? I extends {
      type: "ok";
      value: infer Name extends string;
      rest: infer A extends string;
    }
    ? ExpectDirectives<A, `${Name} extension - directives`> extends infer I
      ? I extends {
          type: "ok";
          value: infer Dir extends Directives;
          rest: infer B extends string;
        }
        ? B extends `=${infer C}`
          ? TrimStart<C> extends `|${string}`
            ? Internal<TrimStart<C>, Name, Dir, []>
            : ExpectName<
                TrimStart<C>,
                `${Name} extension - union member type`
              > extends infer I
            ? I extends {
                type: "ok";
                value: infer UnionMemberType extends string;
                rest: infer E extends string;
              }
              ? Internal<E, Name, Dir, [UnionMemberType]>
              : I
            : never
          : Validate<B, Name, Dir, []>
        : I
      : never
    : I
  : never;

type Internal<
  S extends string,
  Name extends string,
  Dir extends Directives,
  R extends string[]
> = S extends `|${infer A}`
  ? ExpectName<
      TrimStart<A>,
      `${Name} extension - union member type`
    > extends infer I
    ? I extends {
        type: "ok";
        value: infer UnionMemberType extends string;
        rest: infer B extends string;
      }
      ? Internal<B, Name, Dir, [...R, UnionMemberType]>
      : I
    : never
  : Validate<S, Name, Dir, R>;

type Validate<
  S extends string,
  Name extends string,
  Dir extends Directives,
  UnionMemberTypes extends string[]
> = IsValid<Dir, UnionMemberTypes> extends true
  ? Ensure<
      {
        type: "ok";
        value: {
          type: "typeSystem";
          subType: "extension";
          extensionType: "type";
          typeType: "union";
          name: Name;
          directives: Dir;
          unionMemberTypes: UnionMemberTypes;
        };
        rest: S;
      },
      ExpectResultOk<UnionTypeExtension>
    >
  : Ensure<
      {
        type: "error";
        error: "Expected Directives or UnionMemberTypes";
        on: `${Name} extension`;
      },
      ExpectResultError
    >;

type IsValid<
  Dir extends Directives,
  UnionMemberTypes extends string[]
> = Dir["length"] extends 0
  ? UnionMemberTypes["length"] extends 0
    ? false
    : true
  : true;

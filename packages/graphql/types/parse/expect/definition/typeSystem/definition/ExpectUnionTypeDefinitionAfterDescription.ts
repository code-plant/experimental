import { Ensure } from "@this-project/util-common-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../../internal-types";
import { Directives, UnionTypeDefinition } from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";

export type ExpectUnionTypeDefinitionAfterDescription<
  S extends string,
  Description extends string | undefined
> = ExpectName<S, "top level - union type definition"> extends {
  type: "ok";
  value: "union";
  rest: infer A extends string;
}
  ? ExpectName<A, "top level - union type definition"> extends infer I
    ? I extends {
        type: "ok";
        value: infer Name extends string;
        rest: infer B extends string;
      }
      ? ExpectDirectives<B, `${Name} definition - directives`> extends infer I
        ? I extends {
            type: "ok";
            value: infer Dir extends Directives;
            rest: infer C extends string;
          }
          ? C extends `=${infer D}`
            ? TrimStart<D> extends `|${string}`
              ? Internal<TrimStart<D>, Description, Name, Dir, []>
              : ExpectName<
                  TrimStart<D>,
                  `${Name} definition - union member type`
                > extends infer I
              ? I extends {
                  type: "ok";
                  value: infer UnionMemberType extends string;
                  rest: infer E extends string;
                }
                ? Internal<E, Description, Name, Dir, [UnionMemberType]>
                : I
              : never
            : Ensure<
                {
                  type: "ok";
                  value: {
                    type: "typeSystem";
                    subType: "definition";
                    definitionType: "type";
                    typeType: "union";
                    description: Description;
                    name: Name;
                    directives: Dir;
                    unionMemberTypes: [];
                  };
                  rest: C;
                },
                ExpectResultOk<UnionTypeDefinition>
              >
          : I
        : never
      : I
    : never
  : Ensure<
      {
        type: "error";
        error: "Expected keyword union";
        on: "top level - union type definition";
      },
      ExpectResultError
    >;

type Internal<
  S extends string,
  Description extends string | undefined,
  Name extends string,
  Dir extends Directives,
  R extends string[]
> = S extends `|${infer A}`
  ? ExpectName<
      TrimStart<A>,
      `${Name} definition - union member type`
    > extends infer I
    ? I extends {
        type: "ok";
        value: infer UnionMemberType extends string;
        rest: infer B extends string;
      }
      ? Internal<B, Description, Name, Dir, [...R, UnionMemberType]>
      : I
    : never
  : Ensure<
      {
        type: "ok";
        value: {
          type: "typeSystem";
          subType: "definition";
          definitionType: "type";
          typeType: "union";
          description: Description;
          name: Name;
          directives: Dir;
          unionMemberTypes: R;
        };
        rest: S;
      },
      ExpectResultOk<UnionTypeDefinition>
    >;

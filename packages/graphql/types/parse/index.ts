import { Ensure, Result } from "@this-project/util-common-types";
import { ExpectDefinition } from "./expect/definition/ExpectDefinition";
import { TrimStart } from "./internal-types";
import { Definition } from "./types";

export type Parse<S extends string> = ParseInternal<TrimStart<S>, []>;

type ParseInternal<S extends string, R extends Definition[]> = S extends ""
  ? Ensure<{ type: "ok"; value: R }, Result<Definition[]>>
  : ExpectDefinition<S> extends infer I
  ? I extends {
      type: "ok";
      value: infer A extends Definition;
      rest: infer B extends string;
    }
    ? ParseInternal<B, [...R, A]>
    : I
  : never;

export type * from "./types";

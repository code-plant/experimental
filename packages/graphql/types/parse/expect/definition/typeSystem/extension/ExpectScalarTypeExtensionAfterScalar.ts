import { Ensure } from "@this-project/common-util-types";
import { ExpectResultError, ExpectResultOk } from "../../../../internal-types";
import { Directives, ScalarTypeExtension } from "../../../../types";
import { ExpectDirectives } from "../../../ExpectDirectives";
import { ExpectName } from "../../../ExpectName";

export type ExpectScalarTypeExtensionAfterScalar<S extends string> = ExpectName<
  S,
  "top level - scalar extension"
> extends infer I
  ? I extends {
      type: "ok";
      value: infer Name extends string;
      rest: infer A extends string;
    }
    ? ExpectDirectives<A, `${Name} - directives`> extends infer I
      ? I extends {
          type: "ok";
          value: infer Dir extends Directives;
          rest: infer B extends string;
        }
        ? Dir["length"] extends 0
          ? Ensure<
              {
                type: "error";
                error: "Expected directive";
                on: `${Name} extension`;
              },
              ExpectResultError
            >
          : Ensure<
              {
                type: "ok";
                value: {
                  type: "typeSystem";
                  subType: "extension";
                  extensionType: "type";
                  typeType: "scalar";
                  name: Name;
                  directives: Dir;
                };
                rest: B;
              },
              ExpectResultOk<ScalarTypeExtension>
            >
        : I
      : never
    : I
  : never;

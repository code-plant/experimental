import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../internal-types";
import { OperationType, RootOperationTypeDefinition } from "../../../types";
import { ExpectName } from "../../ExpectName";

export type ExpectRootOperationTypesDefinition<S extends string> =
  S extends `{${infer A}`
    ? Internal<TrimStart<A>, []>
    : Ensure<{ type: "error"; error: "Expected {" }, ExpectResultError>;

type Internal<
  S extends string,
  RootOperationTypeDefinitions extends RootOperationTypeDefinition[]
> = S extends `}${infer I}`
  ? Ensure<
      {
        type: "ok";
        value: RootOperationTypeDefinitions;
        rest: TrimStart<I>;
      },
      ExpectResultOk<RootOperationTypeDefinition[]>
    >
  : ExpectName<S> extends {
      type: "ok";
      value: infer OT extends OperationType;
      rest: infer A extends string;
    }
  ? A extends `:${infer B}`
    ? ExpectName<TrimStart<B>> extends infer I
      ? I extends {
          type: "ok";
          value: infer Name extends string;
          rest: infer A extends string;
        }
        ? Internal<
            A,
            [...RootOperationTypeDefinitions, { operationType: OT; type: Name }]
          >
        : I
      : never
    : Ensure<{ type: "error"; error: "Expected :" }, ExpectResultError>
  : Ensure<
      { type: "error"; error: "Expected OperationType" },
      ExpectResultError
    >;

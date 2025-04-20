import { Ensure } from "@this-project/common-util-types";
import {
  ExpectResultError,
  ExpectResultOk,
  TrimStart,
} from "../../../internal-types";
import { OperationType, RootOperationTypeDefinition } from "../../../types";
import { ExpectName } from "../../ExpectName";

export type ExpectRootOperationTypesDefinition<
  S extends string,
  On extends string
> = S extends `{${infer A}`
  ? Internal<TrimStart<A>, [], On>
  : Ensure<{ type: "error"; error: "Expected {"; on: On }, ExpectResultError>;

type Internal<
  S extends string,
  RootOperationTypeDefinitions extends RootOperationTypeDefinition[],
  On extends string
> = S extends `}${infer I}`
  ? Ensure<
      {
        type: "ok";
        value: RootOperationTypeDefinitions;
        rest: TrimStart<I>;
      },
      ExpectResultOk<RootOperationTypeDefinition[]>
    >
  : ExpectName<S, On> extends {
      type: "ok";
      value: infer OT extends OperationType;
      rest: infer A extends string;
    }
  ? A extends `:${infer B}`
    ? ExpectName<TrimStart<B>, On> extends infer I
      ? I extends {
          type: "ok";
          value: infer Name extends string;
          rest: infer A extends string;
        }
        ? Internal<
            A,
            [
              ...RootOperationTypeDefinitions,
              { operationType: OT; type: Name }
            ],
            On
          >
        : I
      : never
    : Ensure<{ type: "error"; error: "Expected :"; on: On }, ExpectResultError>
  : Ensure<
      { type: "error"; error: "Expected OperationType"; on: On },
      ExpectResultError
    >;

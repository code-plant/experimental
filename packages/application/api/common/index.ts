import { APIRouteBase } from "@this-project/util-types-common";

// branded types
export type Id<T extends string> = string & { " id": T };
export type Cursor<Method extends APIRouteBase["method"], Path> = string & {
  " method": Method;
  " path": Path;
};

export type CountEstimationView =
  | { type: "exact"; count: number }
  | { type: "range"; min: number; max: number }
  | { type: "relation"; count: number; relation: "gt" | "gte" | "lt" | "lte" };

export interface Page<
  T,
  CursorType extends Cursor<APIRouteBase["method"], string>
> {
  nodes: T[];
  cursor: CursorType;
}

export interface PageWithTotal<
  T,
  CursorType extends Cursor<APIRouteBase["method"], string>
> extends Page<T, CursorType> {
  total: number;
}

export interface PageWithTotalEstimation<
  T,
  CursorType extends Cursor<APIRouteBase["method"], string>
> extends Page<T, CursorType> {
  total: CountEstimationView;
}

export type Result<T, E> = ResultOk<T> | ResultError<E>;
export type ResultOk<T> = { success: true; result: T };
export type ResultError<E> = { success: false; error: E };

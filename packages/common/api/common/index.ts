// branded type
export type Id<T extends string> = string & { " id": T };

export type CountEstimationView =
  | { type: "exact"; count: number }
  | { type: "range"; min: number; max: number }
  | { type: "relation"; count: number; relation: "gt" | "gte" | "lt" | "lte" };

export interface Page<T, CursorType extends string = string> {
  nodes: T[];
  cursor: CursorType;
}

export interface PageWithTotal<T, CursorType extends string = string>
  extends Page<T, CursorType> {
  total: number;
}

export interface PageWithTotalEstimation<T, CursorType extends string = string>
  extends Page<T, CursorType> {
  total: CountEstimationView;
}

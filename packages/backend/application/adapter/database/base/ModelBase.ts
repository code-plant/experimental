export interface ModelBase {
  name: string;
  scalars: Partial<Record<string, string | number | bigint | boolean | Date>>;
  objects: Partial<Record<string, ModelBase | ModelBase[]>>;
  uniqueIndices: string[][];
  indices: string[][];
}

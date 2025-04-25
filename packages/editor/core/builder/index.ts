import {
  Document,
  NodeBase,
  Plugin,
  ValidationError,
} from "@this-project/editor-core-types";
import { Result } from "@this-project/util-common-types";

export class Builder<T extends NodeBase, E> {
  constructor(private readonly result: Result<Document<T>, E>) {}

  apply<U extends NodeBase>(
    plugin: Plugin<T, U>
  ): Builder<U, E | ValidationError<T>> {
    if (this.result.type === "error") {
      return new Builder(this.result);
    }
    const document = plugin(this.result.value);
    return new Builder(document);
  }

  build(): Result<Document<T>, E> {
    return this.result;
  }
}

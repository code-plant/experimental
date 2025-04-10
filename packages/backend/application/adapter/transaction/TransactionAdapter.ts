import { Awaitable } from "@this-project/common-util-types";

export interface TransactionManager {
  commit: () => Promise<void>;
  rollback: () => Promise<void>;
}

export interface TransactionAdapter<T> {
  transaction: <R>(
    doWork: (transactionManager: TransactionManager) => Awaitable<R>
  ) => Promise<R>;
  fetchFailedTransaction: () => Promise<T | undefined>;
}

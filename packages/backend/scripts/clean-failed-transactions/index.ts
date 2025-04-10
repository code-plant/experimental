import { TransactionAdapter } from "@this-project/backend-application-adapter";
import { Transaction } from "@this-project/backend-application-transaction";

// TODO: implement, import
declare const MyTransactionAdapter: new <T>() => TransactionAdapter<T>;
declare const removeFileIfExists: (id: string) => Promise<void>;

(async () => {
  const transactionAdapter = new MyTransactionAdapter<Transaction>();

  let failedTransaction: Transaction | undefined;
  while (
    (failedTransaction = await transactionAdapter.fetchFailedTransaction())
  ) {
    switch (failedTransaction.type) {
      case "UPLOAD_FILE":
        await removeFileIfExists(failedTransaction.id);
    }
  }
})();

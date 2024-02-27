export interface ITransactionService {
  executeTransaction(callback: Function): Promise<void>;
}

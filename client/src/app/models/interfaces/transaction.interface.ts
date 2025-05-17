import {TransactionType} from '../enums/transaction-type';

export interface Transaction {
  id: number;
  transactionDate: Date;
  amount: number;
  type: TransactionType;
  description: string;
}

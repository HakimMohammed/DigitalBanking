import {AccountStatus} from '../enums/account-status';
import {Customer} from './customer.interface';

export interface Account {
  id: string;
  balance: number;
  createdAt: Date;
  status: AccountStatus;
  type: string,
  customer: Customer,
}

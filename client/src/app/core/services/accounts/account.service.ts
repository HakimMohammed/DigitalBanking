import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Account} from '../../../models/interfaces/account.interface';
import {API_URL} from '../../../../environement/environment';
import {Transaction} from '../../../models/interfaces/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http: HttpClient) {
  }

  public getAccounts(): Observable<Array<Account>> {
    return this.http.get<Array<Account>>(API_URL + 'accounts');
  }

  public getAccountOperations(accountId: string): Observable<Array<Transaction>> {
    return this.http.get<Array<Transaction>>(API_URL + 'accounts/' + accountId + '/operations');
  }

  public debit(data: {
    accountId: string,
    amount: number,
    description: string
  } ): Observable<any> {
    return this.http.post<any>(API_URL + 'accounts/debit', data);
  }

  public credit(data: {
    accountId: string,
    amount: number,
    description: string
  } ): Observable<any> {
    return this.http.post<any>(API_URL + 'accounts/credit', data);
  }

  public transfer(data: {
    sourceAccountId: string,
    destinationAccountId: string,
    amount: number,
    description: string
  }): Observable<any> {
    return this.http.post<any>(API_URL + 'accounts/transfer', {
      accountSource: data.sourceAccountId,
      accountDestination: data.destinationAccountId,
      amount: data.amount,
      description: data.description
    });
  }

}


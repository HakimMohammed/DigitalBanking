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
}

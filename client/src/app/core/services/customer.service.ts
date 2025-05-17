import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {API_URL} from '../../../environement/environment';
import {Observable} from 'rxjs';
import {Customer} from '../../models/interfaces/customer.interface';

@Injectable({
  providedIn: 'root'
})

export class CustomerService {

  constructor(private http: HttpClient) {}

  public getCustomers(): Observable<Array<Customer>> {
    return this.http.get<Array<Customer>>(API_URL + 'customers');
  }

  createCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(API_URL + 'customers', customer);
  }

  editCustomer(customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(API_URL + 'customers/' + customer.id , customer);
  }

  deleteCustomer(id: number): Observable<any> {
    return this.http.delete<any>(API_URL + 'customers/' + id);
  }
}

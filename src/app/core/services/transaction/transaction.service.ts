import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Transaction} from '../../../transactions/model/transaction';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {TransactionsPage} from "../../../transactions/model/transactions.page";
import * as moment from 'moment';

@Injectable({providedIn: 'root'})
export class TransactionService {
  constructor(private http: HttpClient) {
  }

  public list(page: number, size: number): Observable<TransactionsPage> {
    const params = new HttpParams().append('page', page).append('size', size).append('sort', 'date,desc');

    return this.http.get<any>(environment.apiURL + 'transactions', {params: params})
      .pipe(map(result => {
        if (result._embedded) {
          return new TransactionsPage(result._embedded.transactions as Transaction[], result.page.number, result.page.size, result.page.totalElements, result.page.totalPages);
        } else {
          return new TransactionsPage([], 0, 0, 0, 0);
        }
      }));
  }

  public save(transaction: Transaction): Observable<Transaction> {
    const date = moment(transaction.date).format('YYYY-MM-DD');
    const payload = JSON.parse(JSON.stringify(transaction));
    payload.date = date;

    return this.http.post<Transaction>(environment.apiURL + 'transactions', payload);
  }

  public fetch(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(environment.apiURL + 'transactions/' + id);
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(environment.apiURL + 'transactions/' + id);
  }

  public listIncomingTransactionsForBalance(month: number, year: number): Observable<Transaction[]> {
    return this.http.get<any>(environment.apiURL + 'transactions/incoming-for-balance/' + year + '/' + (month + 1))
      .pipe(map(result => {
        if (result._embedded) {
          return result._embedded.transactions as Transaction[];
        } else {
          return [];
        }
      }));
  }
}

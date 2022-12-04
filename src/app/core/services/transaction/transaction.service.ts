import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Transaction} from '../../../transactions/model/transaction';
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {TransactionsPage} from "../../../transactions/model/transactions.page";

@Injectable({providedIn: 'root'})
export class TransactionService {
  constructor(private http: HttpClient) {
  }

  public list(page: number, size: number): Observable<TransactionsPage> {
    const params = new HttpParams().append('page', page).append('size', size).append('sort', 'date,desc');

    return this.http.get<any>(environment.baseUrl + 'transactions', {params: params})
      .pipe(map(result => {
        let transactions: Transaction[] = [];
        if (result._embedded) {
          transactions = result._embedded.transactions as Transaction[];
        }
        return new TransactionsPage(transactions, result.page.number, result.page.size, result.page.totalElements, result.page.totalPages);
      }));
  }

  public save(account: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(environment.baseUrl + 'transactions', account);
  }

  public fetch(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(environment.baseUrl + 'transactions/' + id);
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(environment.baseUrl + 'transactions/' + id);
  }

  public listIncomingTransactionsForBalance(month: number, year: number): Observable<Transaction[]> {
    return this.http.get<any>(environment.baseUrl + 'transactions/incoming-for-balance/' + year + '/' + month)
      .pipe(map(result => {
        if (result._embedded) {
          return result._embedded.transactions as Transaction[];
        } else {
          return [];
        }
      }));
  }
}

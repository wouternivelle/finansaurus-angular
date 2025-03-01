import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {Account} from "../../../accounts/model/account";

@Injectable({providedIn: 'root'})
export class AccountService {
  constructor(private http: HttpClient) {
  }

  public list(): Observable<Account[]> {
    return this.http.get<any>(environment.apiURL + 'accounts')
      .pipe(map(result => {
        if (result._embedded) {
          return result._embedded.accounts as Account[];
        } else {
          return [];
        }
      }));
  }

  public save(account: Account): Observable<Account> {
    return this.http.post<Account>(environment.apiURL + 'accounts', account);
  }

  public fetch(id: number): Observable<Account> {
    return this.http.get<Account>(environment.apiURL + 'accounts/' + id);
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(environment.apiURL + 'accounts/' + id);
  }
}

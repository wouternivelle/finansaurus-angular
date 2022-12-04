import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Payee} from '../../../payees/model/payee';
import {map} from 'rxjs/operators';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class PayeeService {
  constructor(private http: HttpClient) {
  }

  public list(): Observable<Payee[]> {
    return this.http.get<any>(environment.baseUrl + 'payees')
      .pipe(map(result => {
        if (result._embedded) {
          return result._embedded.payees as Payee[];
        } else {
          return [];
        }
      }));
  }

  public save(payee: Payee): Observable<Payee> {
    return this.http.post<Payee>(environment.baseUrl + 'payees', payee);
  }

  public fetch(id: number): Observable<Payee> {
    return this.http.get<Payee>(environment.baseUrl + 'payees/' + id);
  }

  public delete(id: number): Observable<Object> {
    return this.http.delete(environment.baseUrl + 'payees/' + id);
  }
}

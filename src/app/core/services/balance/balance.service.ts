import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Balance, BalanceCategory} from '../../../balances/model/balance';
import { HttpClient } from "@angular/common/http";
import {environment} from "../../../../environments/environment";

@Injectable({providedIn: 'root'})
export class BalanceService {
  constructor(private http: HttpClient) {
  }

  public list(selectedDate: Date): Observable<Balance[]> {
    return this.http.get<any>(environment.apiURL + 'balances/' + selectedDate.getFullYear() + "/" + (selectedDate.getMonth() + 1))
      .pipe(map(result => {
        if (result._embedded) {
          let balances = result._embedded.balances as Balance[];
          balances.forEach(balance => {
            balance.month = balance.month - 1; // Correction for zero-index
          });
          return balances;
        } else {
          return [];
        }
      }));
  }

  public updateBudget(balance: Balance, categoryId: number, value: number, categoryIds: number[]): Observable<Balance> {
    this.cleanCategories(balance, categoryIds);

    const balanceCategory = balance.categories
      .find((element) => categoryId === element.categoryId);

    if (!balanceCategory) {
      balance.categories.push(new BalanceCategory(categoryId, value, 0, value));
    } else {
      balanceCategory.budgeted = value;
    }

    return this.save(balance);
  }

  public save(balance: Balance): Observable<Balance> {
    balance.month = balance.month + 1; // Correction for zero-index
    return this.http.post<Balance>(environment.apiURL + 'balances', balance).pipe(map(balance => {
      balance.month = balance.month - 1; // Correction for zero-index
      return balance;
    }));
  }

  public usePreviousMonthValues(balance: Balance): Observable<Balance> {
    return this.http.patch<Balance>(environment.apiURL + 'balances/use-previous-month', balance)
  }

  private cleanCategories(balance: Balance, categoryIds: number[]) {
    if (balance.categories.length > 0) {
      balance.categories.forEach((item, index) => {
        if (categoryIds.indexOf(item.categoryId) < 0) {
          balance.categories.splice(index, 1);
        }
      });
    }
  }
}

import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {Balance} from '../model/balance';
import moment from 'moment';
import {BalanceService} from '../../core/services/balance/balance.service';
import { MatProgressBar } from '@angular/material/progress-bar';
import { BalanceDetailComponent } from '../balance-detail/balance-detail.component';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { MatCard, MatCardHeader, MatCardTitle } from '@angular/material/card';

@Component({
    selector: 'app-balances-list',
    templateUrl: './balance-list.component.html',
    styleUrls: ['./balance-list.component.css'],
    standalone: true,
    imports: [MatCard, MatCardHeader, MatCardTitle, NgIf, MatButton, MatIcon, BalanceDetailComponent, MatProgressBar]
})
export class BalanceListComponent implements OnInit {
  balanceLoaded: Subject<Balance> = new Subject<Balance>();
  balances: Balance[] = [];
  loading: boolean = false;

  selectedDate: Date = moment().startOf('month').toDate();
  selectedBalance: Balance | undefined;

  constructor(private balanceService: BalanceService) {
  }

  ngOnInit() {
    this.loadBalances();
  }

  private loadBalances() {
    this.loading = true;

    this.balancesLoaded();
  }

  private findBalance(): Balance {
    const date = moment(this.selectedDate);
    const year: number = date.year();
    const month: number = date.month();

    return this.balances.find(balance => balance.month === month && balance.year === year)!;
  }

  private balancesLoaded(): void {
    this.balanceService.list(this.selectedDate)
      .subscribe((balances) => {
        this.balances = balances;

        let balance = this.findBalance();
        this.balanceLoaded.next(balance);
        this.selectedBalance = balance;
        this.loading = false;
      });
  }

  onLoadPreviousMonth() {
    this.loading = true;
    this.selectedDate.setMonth(this.selectedDate.getMonth() - 1);

    this.balancesLoaded();
  }

  onLoadNextMonth() {
    this.loading = true;
    this.selectedDate.setMonth(this.selectedDate.getMonth() + 1);

    this.balancesLoaded();
  }
}

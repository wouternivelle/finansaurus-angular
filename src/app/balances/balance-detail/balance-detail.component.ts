import {Component, Input, OnInit} from '@angular/core';
import {combineLatest, Observable} from 'rxjs';
import {Balance, BalanceCategory} from '../model/balance';
import {BalanceService} from '../../core/services/balance/balance.service';
import {Category, CategoryType} from '../../categories/model/category';
import {NotificationService} from '../../core/services/notification.service';
import {CategoryService} from '../../core/services/category/category.service';
import {TransactionService} from '../../core/services/transaction/transaction.service';
import * as TransformationHelper from '../../shared/helper/transformation.helper';
import {MatDialog} from '@angular/material/dialog';
import {BalanceTransactionDialogComponent} from '../balance-transaction-dialog/balance-transaction-dialog.component';

@Component({
  selector: 'app-balances-detail',
  templateUrl: './balance-detail.component.html',
  styleUrls: ['./balance-detail.component.css']
})
export class BalanceDetailComponent implements OnInit {
  balance: Balance | undefined;
  categories: Category[] = [];
  incomingNextMonth = 0;

  @Input() balanceLoaded!: Observable<Balance>;

  budgeted = 0;
  generalCategories: Category[] = [];

  date: Date = new Date();

  displayedColumns = ['name', 'budgeted', 'outflow', 'balance'];

  constructor(private balanceService: BalanceService,
              private notificationService: NotificationService,
              private categoryService: CategoryService,
              private transactionService: TransactionService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    combineLatest([
      this.balanceLoaded,
      this.categoryService.listWithoutSystem()
    ])
      .subscribe(([balance, categories]) => {
        this.balance = balance;
        this.categories = categories;
        this.budgeted = balance.budgeted;

        this.generalCategories = TransformationHelper.orderCategories(
          this.categories.filter(cat => cat.type === CategoryType.GENERAL && !cat.hidden)
        );

        this.date = new Date(this.balance.year, this.balance.month);

        let nextMonth = new Date(this.balance.year, this.balance.month);
        nextMonth.setMonth(this.date.getMonth() + 1);
        this.transactionService.listIncomingTransactionsForBalance(nextMonth.getMonth(), nextMonth.getFullYear()).subscribe(transactions => {
          transactions.forEach(transaction => {
            this.incomingNextMonth += transaction.amount;
          });
        });
      });
  }

  onBudgetCategoryEnter(categoryId: number, event: Event, categoryName: string) {
    const value = (event.target as HTMLInputElement).value;
    this.balanceService.updateBudget(this.balance!, categoryId, Number(value), this.categories.map(c => c.id!))
      .subscribe(balance => {
        this.balance = balance;
        this.notificationService.notify(categoryName + ' is updated with ' + value);
      });
  }

  determineBalanceForCategory(categoryId: number): number {
    if (this.balance) {
      return this.findCategory(this.balance, categoryId).balance;
    }
    return 0;
  }

  determineTotalBudgeted(): number {
    if (this.balance) {
      let total = 0;
      this.balance.categories.forEach(category => total += category.budgeted);
      return total;
    }
    return 0;
  }

  determineTotalOperations(): number {
    if (this.balance) {
      let total = 0;
      this.balance.categories.forEach(category => total += category.operations);
      return total;
    }
    return 0;
  }

  determineTotalBalance(): number {
    if (this.balance) {
      let total = 0;
      this.balance.categories.forEach(category => total += category.balance);
      return total;
    }
    return 0;
  }

  onUsePreviousValues(): void {
    this.balanceService.usePreviousMonthValues(this.balance!)
      .subscribe(balance => {
        this.balance = balance;
        this.notificationService.notify('The values for the previous month have been used.');
      });
  }

  loadIncomingTransactions(): void {
    this.transactionService.listIncomingTransactionsForBalance(this.balance!.month, this.balance!.year)
      .subscribe(transactions => {
        this.dialog.open(BalanceTransactionDialogComponent, {
          width: '500px',
          data: transactions
        });
      });
  }

  loadTransactions(categoryId: number): void {
    this.transactionService.listTransactionsForMonthAndCategory(this.balance!.month, this.balance!.year, categoryId)
      .subscribe(transactions => {
        this.dialog.open(BalanceTransactionDialogComponent, {
          width: '500px',
          data: transactions
        });
      });
  }

  findCategory(balance: Balance, categoryId: number): BalanceCategory {
    const balanceCategory = balance.categories
      .find((element) => categoryId === element.categoryId);

    if (balanceCategory) {
      return balanceCategory;
    } else {
      return new BalanceCategory(categoryId, 0, 0, 0);
    }
  }
}

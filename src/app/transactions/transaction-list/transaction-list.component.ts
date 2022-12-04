import {Component, OnInit, ViewChild} from '@angular/core';
import {BaseDirective} from '../../shared/base.directive';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {PayeeService} from '../../core/services/payee/payee.service';
import {Transaction} from '../model/transaction';
import {MatTableDataSource} from '@angular/material/table';
import {Category} from '../../categories/model/category';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Payee} from '../../payees/model/payee';
import {MatSort} from '@angular/material/sort';
import {TransactionService} from '../../core/services/transaction/transaction.service';
import {ActivatedRoute} from '@angular/router';
import {CategoryService} from '../../core/services/category/category.service';
import {AccountService} from '../../core/services/account/account.service';
import {NotificationService} from '../../core/services/notification.service';
import {combineLatest} from 'rxjs';
import {Account} from '../../accounts/model/account';
import {TransactionsPage} from "../model/transactions.page";

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent extends BaseDirective implements OnInit {
  transactions: Transaction[] = [];
  datasource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>([]);
  selectedAccountId: number | undefined;
  accounts: Account[] = [];
  categories: Category[] = [];
  payees: Payee[] = [];
  categoryMap: Map<number, string> = new Map<number, string>();
  payeeMap: Map<number, string> = new Map<number, string>();

  pageLength = 0;
  pageIndex = 0;
  pageSize = 5;
  pageSizeOptions = [1,5,10];

  displayedColumns = ['date', 'amount', 'category', 'payee', 'note', 'actions'];

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor(private transactionService: TransactionService,
              private route: ActivatedRoute,
              private categoryService: CategoryService,
              private payeeService: PayeeService,
              private accountService: AccountService,
              private dialog: MatDialog,
              private notificationService: NotificationService) {
    super();
  }

  ngOnInit(): void {
    // Verify if there's already an account given
    const accountId = Number(this.route.snapshot.queryParams['accountId']);
    if (accountId) {
      this.selectedAccountId = accountId;
    }

    // Fetch the categories, payees, accounts and balances
    combineLatest([this.categoryService.list(), this.payeeService.list(), this.accountService.list(), this.transactionService.list(this.pageIndex, this.pageSize)])
      .subscribe(([categories, payees, accounts, transactionsPage]) => {
        this.categories = categories;
        this.payees = payees;
        this.accounts = accounts;
        this.handleTransactionsPage(transactionsPage);

        this.categoryMap = new Map<number, string>(
          this.categories.map((a) => [a.id, a.name] as [number, string])
        );

        this.payeeMap = new Map<number, string>(
          this.payees.map((a) => [a.id, a.name] as [number, string])
        );
      });
  }

  onDelete(transaction: Transaction): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete this transaction?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && transaction.id) {
        this.transactionService.delete(transaction.id).subscribe(() => {
          this.notificationService.openSnackBar('Transaction is deleted');
          this.loadTransactions();
        });
      }
    });
  }

  onPage(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadTransactions();
  }

  private loadTransactions() {
    this.transactionService.list(this.paginator.pageIndex, this.paginator.pageSize)
      .subscribe(transactionsPage => this.handleTransactionsPage(transactionsPage));
  }

  private handleTransactionsPage(transactionsPage: TransactionsPage) {
    this.transactions = transactionsPage.transactions;
    this.datasource.data = transactionsPage.transactions;
    this.pageLength = transactionsPage.totalElements;
    this.pageIndex = transactionsPage.index;
    this.pageSize = transactionsPage.size;
  }
}

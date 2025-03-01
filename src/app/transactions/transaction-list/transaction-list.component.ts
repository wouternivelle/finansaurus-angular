import {Component, OnInit, ViewChild} from '@angular/core';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {PayeeService} from '../../core/services/payee/payee.service';
import {Transaction} from '../model/transaction';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {Category} from '../../categories/model/category';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {Payee} from '../../payees/model/payee';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import {TransactionService} from '../../core/services/transaction/transaction.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {CategoryService} from '../../core/services/category/category.service';
import {AccountService} from '../../core/services/account/account.service';
import {NotificationService} from '../../core/services/notification.service';
import {combineLatest} from 'rxjs';
import {Account} from '../../accounts/model/account';
import {TransactionsPage} from "../model/transactions.page";
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatMenuTrigger, MatMenu, MatMenuContent, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';
import { NgIf, NgClass, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css'],
    imports: [NgIf, MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton, RouterLink, MatIcon, MatPaginator, MatTable, MatSort, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatSortHeader, MatCellDef, MatCell, NgClass, MatIconButton, MatMenuTrigger, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatProgressBar, MatMenu, MatMenuContent, MatMenuItem, CurrencyPipe, DatePipe]
})
export class TransactionListComponent implements OnInit {
  transactions: Transaction[] = [];
  datasource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>([]);
  selectedAccountId: number | undefined;
  accounts: Account[] = [];
  categories: Category[] = [];
  payees: Payee[] = [];
  categoryMap: Map<number, string> = new Map<number, string>();
  payeeMap: Map<number, string> = new Map<number, string>();

  loading: boolean = false;

  pageLength = 0;
  pageIndex = 0;
  pageSize = 15;
  pageSizeOptions = [15, 30, 50];

  displayedColumns = ['date', 'amount', 'payee', 'category', 'note', 'actions'];

  @ViewChild(MatPaginator, {static: true}) paginator!: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort!: MatSort;

  constructor(private transactionService: TransactionService,
              private route: ActivatedRoute,
              private categoryService: CategoryService,
              private payeeService: PayeeService,
              private accountService: AccountService,
              private dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit(): void {
    this.loading = true;
    // Verify if there's already an account given
    const accountId = Number(this.route.snapshot.queryParams['accountId']);
    if (accountId) {
      this.selectedAccountId = accountId;
    }

    // If there's a pagination stored in the session, use it
    const transactionPagination = sessionStorage.getItem('transaction-pagination');
    if (transactionPagination) {
      this.pageSize = Number(transactionPagination);
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

        this.loading = false;
      });
  }

  onDelete(transaction: Transaction): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete this transaction?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && transaction.id) {
        this.transactionService.delete(transaction.id).subscribe(() => {
          this.notificationService.notify('Transaction is deleted');
          this.loadTransactions();
        });
      }
    });
  }

  onPage(e: PageEvent) {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.loadTransactions();

    // Store page size in session
    sessionStorage.setItem('transaction-pagination', String(this.pageSize));
  }

  private loadTransactions() {
    this.loading = true;
    this.transactionService.list(this.pageIndex, this.pageSize)
      .subscribe(transactionsPage => {
        this.handleTransactionsPage(transactionsPage)
        this.loading = false;
      });
  }

  private handleTransactionsPage(transactionsPage: TransactionsPage) {
    this.transactions = transactionsPage.transactions;
    this.datasource.data = transactionsPage.transactions;
    this.pageLength = transactionsPage.totalElements;
    this.pageIndex = transactionsPage.index;
    this.pageSize = transactionsPage.size;
  }
}

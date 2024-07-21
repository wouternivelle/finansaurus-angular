import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {take} from 'rxjs/operators';
import { MatTableDataSource, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import {Transaction} from '../../transactions/model/transaction';
import {PayeeService} from '../../core/services/payee/payee.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { NgIf, NgClass, CurrencyPipe, DatePipe } from '@angular/common';

@Component({
    selector: 'app-balance-transaction-dialog',
    templateUrl: './balance-transaction-dialog.component.html',
    styleUrls: ['./balance-transaction-dialog.component.css'],
    standalone: true,
    imports: [NgIf, MatProgressSpinner, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, NgClass, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, CurrencyPipe, DatePipe]
})
export class BalanceTransactionDialogComponent implements OnInit {

  loading = false;
  transactions: Transaction[];
  payeeMap: Map<number, string> = new Map<number, string>();
  datasource: MatTableDataSource<Transaction> = new MatTableDataSource<Transaction>([]);

  displayedColumns = ['date', 'amount', 'payee'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: Transaction[],
              public payeeService: PayeeService) {
    this.transactions = data;
  }

  ngOnInit(): void {
    this.loading = true;
    this.payeeService.list()
      .pipe(take(1))
      .subscribe(payees => {
        this.payeeMap = new Map<number, string>(
          payees.map((a) => [a.id, a.name] as [number, string])
        );

        this.datasource.data = this.transactions;
        this.loading = false;
      });
  }
}

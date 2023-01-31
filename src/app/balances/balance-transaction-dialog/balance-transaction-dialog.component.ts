import {Component, Inject, OnInit} from '@angular/core';
import {MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA} from '@angular/material/legacy-dialog';
import {take} from 'rxjs/operators';
import {MatLegacyTableDataSource as MatTableDataSource} from '@angular/material/legacy-table';
import {Transaction} from '../../transactions/model/transaction';
import {PayeeService} from '../../core/services/payee/payee.service';

@Component({
  selector: 'app-balance-transaction-dialog',
  templateUrl: './balance-transaction-dialog.component.html',
  styleUrls: ['./balance-transaction-dialog.component.css']
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

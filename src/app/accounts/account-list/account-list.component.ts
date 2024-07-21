import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../core/services/account/account.service';
import {Account} from '../model/account';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../core/services/notification.service';
import { MatMenuTrigger, MatMenu, MatMenuContent, MatMenuItem } from '@angular/material/menu';
import { NgClass, CurrencyPipe } from '@angular/common';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatFooterCellDef, MatFooterCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatFooterRowDef, MatFooterRow } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-account-list',
    templateUrl: './account-list.component.html',
    styleUrls: ['./account-list.component.css'],
    standalone: true,
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatButton, RouterLink, MatIcon, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatFooterCellDef, MatFooterCell, NgClass, MatIconButton, MatMenuTrigger, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatFooterRowDef, MatFooterRow, MatMenu, MatMenuContent, MatMenuItem, CurrencyPipe]
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];

  displayedColumns = ['name', 'total', 'actions'];

  constructor(private accountService: AccountService,
              private dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.load();
  }

  private load() {
    this.accountService.list()
      .subscribe(accounts => {
        this.accounts = accounts;
      });
  }

  determineTotals(): number {
    let total = 0;
    this.accounts.forEach(account => total += account.amount);

    return total;
  }

  onDelete(account: Account) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete this account? This will also delete all corresponding transactions.'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && account.id) {
        this.accountService.delete(account.id)
          .subscribe(() => {
            this.notificationService.notify(account.name + ' is deleted');
            this.load();
          });
      }
    });
  }

  onStar(account: Account) {
    account.starred = true;

    this.accountService.save(account)
      .subscribe(() => {
        this.notificationService.notify(account.name + ' is starred');
        this.load();
      });
  }
}

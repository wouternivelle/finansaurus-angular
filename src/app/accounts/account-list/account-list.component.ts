import {Component, OnInit} from '@angular/core';
import {AccountService} from '../../core/services/account/account.service';
import {Account} from '../model/account';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {NotificationService} from '../../core/services/notification.service';

@Component({
  selector: 'app-account-list',
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.css']
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
            this.notificationService.openSnackBar(account.name + ' is deleted');
            this.load();
          });
      }
    });
  }

  onStar(account: Account) {
    account.starred = true;

    this.accountService.save(account)
      .subscribe(() => {
        this.notificationService.openSnackBar(account.name + ' is starred');
        this.load();
      });
  }
}

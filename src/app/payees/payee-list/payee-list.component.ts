import {Component, OnInit} from '@angular/core';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {PayeeService} from '../../core/services/payee/payee.service';
import {Payee} from '../model/payee';
import {NotificationService} from '../../core/services/notification.service';
import { MatMenuTrigger, MatMenu, MatMenuContent, MatMenuItem } from '@angular/material/menu';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatIconButton, MatButton } from '@angular/material/button';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatFooterCellDef, MatFooterCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-payee-list',
    templateUrl: './payee-list.component.html',
    styleUrls: ['./payee-list.component.css'],
    standalone: true,
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatIconButton, RouterLink, MatIcon, MatMenuTrigger, MatFooterCellDef, MatFooterCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow, MatButton, MatMenu, MatMenuContent, MatMenuItem]
})
export class PayeeListComponent implements OnInit {
  payees: Payee[] = [];

  displayedColumns = ['name', 'actions'];

  constructor(private payeeService: PayeeService,
              private dialog: MatDialog,
              private notificationService: NotificationService) {
  }

  ngOnInit() {
    this.load();
  }

  onDelete(payee: Payee) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete this payee? This will also delete all corresponding transactions.'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && payee.id) {
        this.payeeService.delete(payee.id)
          .subscribe(() => {
            this.notificationService.notify(payee.name + ' is deleted');
            this.load();
          });
      }
    });
  }

  private load() {
    this.payeeService.list()
      .subscribe((payees: Payee[]) => {
        this.payees = payees;
      });
  }
}

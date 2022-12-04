import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {BalancesRoutingModule} from './balances-routing.module';
import {BalanceListComponent} from './balance-list/balance-list.component';
import {BalanceDetailComponent} from './balance-detail/balance-detail.component';
import {BalanceTransactionDialogComponent} from './balance-transaction-dialog/balance-transaction-dialog.component';

@NgModule({
  imports: [CommonModule, BalancesRoutingModule, SharedModule],
  declarations: [BalanceListComponent, BalanceDetailComponent, BalanceTransactionDialogComponent],
  entryComponents: [],
})
export class BalancesModule {
}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {TransactionsRoutingModule} from './transactions-routing.module';
import {TransactionListComponent} from './transaction-list/transaction-list.component';
import {TransactionDetailComponent} from './transaction-detail/transaction-detail.component';

@NgModule({
    imports: [CommonModule, TransactionsRoutingModule, SharedModule, TransactionListComponent, TransactionDetailComponent],
})
export class TransactionsModule {
}

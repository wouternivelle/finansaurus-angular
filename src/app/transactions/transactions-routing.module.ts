import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LayoutComponent} from '../shared/layout/layout.component';
import {TransactionListComponent} from './transaction-list/transaction-list.component';
import {TransactionDetailComponent} from './transaction-detail/transaction-detail.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: TransactionListComponent},
      {path: 'detail', component: TransactionDetailComponent},
      {path: 'detail/:id', component: TransactionDetailComponent}
    ],
  },
];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class TransactionsRoutingModule {
}

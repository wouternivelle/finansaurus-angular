import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LayoutComponent} from '../shared/layout/layout.component';
import {AccountListComponent} from './account-list/account-list.component';
import {AccountDetailComponent} from './account-detail/account-detail.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: AccountListComponent},
      {path: 'detail', component: AccountDetailComponent},
      {path: 'detail/:id', component: AccountDetailComponent}
    ],
  },
];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class AccountsRoutingModule {
}

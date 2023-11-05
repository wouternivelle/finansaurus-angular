import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {AccountDetailComponent} from './account-detail/account-detail.component';
import {AccountsRoutingModule} from './accounts-routing.module';
import {AccountListComponent} from './account-list/account-list.component';

@NgModule({
  imports: [CommonModule, AccountsRoutingModule, SharedModule],
  declarations: [AccountDetailComponent, AccountListComponent],
})
export class AccountsModule {
}

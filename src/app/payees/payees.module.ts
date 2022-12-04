import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {PayeesRoutingModule} from './payees-routing.module';
import {PayeeListComponent} from './payee-list/payee-list.component';
import {PayeeDetailComponent} from "./payee-detail/payee-detail.component";

@NgModule({
  imports: [CommonModule, PayeesRoutingModule, SharedModule],
  declarations: [PayeeDetailComponent, PayeeListComponent],
  entryComponents: [],
})
export class PayeesModule {
}

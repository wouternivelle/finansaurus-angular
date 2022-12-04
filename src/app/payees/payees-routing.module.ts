import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LayoutComponent} from '../shared/layout/layout.component';
import {PayeeListComponent} from './payee-list/payee-list.component';
import {PayeeDetailComponent} from "./payee-detail/payee-detail.component";


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: PayeeListComponent},
      {path: 'detail', component: PayeeDetailComponent},
      {path: 'detail/:id', component: PayeeDetailComponent}
    ],
  },
];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class PayeesRoutingModule {
}

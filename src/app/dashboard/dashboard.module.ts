import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [DashboardHomeComponent],
  imports: [CommonModule, DashboardRoutingModule, SharedModule],
  entryComponents: [],
})
export class DashboardModule {}

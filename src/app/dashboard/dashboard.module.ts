import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {DashboardHomeComponent} from './dashboard-home/dashboard-home.component';
import {DashboardRoutingModule} from './dashboard-routing.module';

@NgModule({
    imports: [CommonModule, DashboardRoutingModule, SharedModule, DashboardHomeComponent],
})
export class DashboardModule {}

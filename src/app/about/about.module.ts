import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AboutHomeComponent } from './about-home/about-home.component';
import { AboutRoutingModule } from './about-routing.module';

@NgModule({
  declarations: [AboutHomeComponent],
  imports: [CommonModule, SharedModule, AboutRoutingModule],
})
export class AboutModule {}

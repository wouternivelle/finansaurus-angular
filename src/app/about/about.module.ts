import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';

import { AboutHomeComponent } from './about-home/about-home.component';
import { AboutRoutingModule } from './about-routing.module';

@NgModule({
    imports: [CommonModule, SharedModule, AboutRoutingModule, AboutHomeComponent],
})
export class AboutModule {}

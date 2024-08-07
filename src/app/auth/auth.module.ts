import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';

@NgModule({
    imports: [CommonModule, SharedModule, AuthRoutingModule, LoginComponent],
})
export class AuthModule {
}

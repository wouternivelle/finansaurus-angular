import {MediaMatcher} from '@angular/cdk/layout';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ErrorHandler, NgModule, Optional, SkipSelf} from '@angular/core';
import {AuthGuard} from './guards/auth.guard';
import {throwIfAlreadyLoaded} from './guards/module-import.guard';
import {GlobalErrorHandler} from './services/globar-error.handler';
import {NGXLogger} from "ngx-logger";
import {JwtAuthInterceptor} from "./interceptor/jwt.auth.interceptor";

@NgModule({
  imports: [CommonModule, HttpClientModule],
  declarations: [],
  providers: [
    AuthGuard,
    MediaMatcher,
    {provide: ErrorHandler, useClass: GlobalErrorHandler},
    {provide: NGXLogger, useClass: NGXLogger},
    {provide: 'LOCALSTORAGE', useValue: window.localStorage},
    {provide: HTTP_INTERCEPTORS, useClass: JwtAuthInterceptor, multi: true},
  ],
  exports: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}

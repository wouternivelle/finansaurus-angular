import {enableProdMode, importProvidersFrom, isDevMode} from '@angular/core';

import {environment} from './environments/environment';
import {AppComponent} from './app/app.component';
import {initializeAuth, provideAuth} from '@angular/fire/auth';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {ServiceWorkerModule} from '@angular/service-worker';
import {LoggerModule, NgxLoggerLevel} from 'ngx-logger';
import {CoreModule} from './app/core/core.module';
import {SharedModule} from './app/shared/shared.module';
import {CustomMaterialModule} from './app/custom-material/custom-material.module';
import {AppRoutingModule} from './app/app-routing.module';
import {provideAnimations} from '@angular/platform-browser/animations';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import {FIREBASE_OPTIONS} from '@angular/fire/compat';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, AppRoutingModule, CustomMaterialModule.forRoot(), SharedModule, CoreModule, LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
      serverLogLevel: NgxLoggerLevel.ERROR
    }), ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => initializeAuth(getApp())),
    {provide: FIREBASE_OPTIONS, useValue: environment.firebase},
    provideAnimations()
  ]
})
  .catch(err => console.error(err));

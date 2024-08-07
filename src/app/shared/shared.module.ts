import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {CustomMaterialModule} from '../custom-material/custom-material.module';

import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {
  ContentPlaceholderAnimationComponent
} from './content-placeholder-animation/content-placeholder-animation.component';
import {LayoutComponent} from './layout/layout.component';
import {LimitToPipe} from './pipes/limit-to.pipe';
import {LocalDatePipe} from './pipes/local-date.pipe';
import {YesNoPipe} from './pipes/yes-no.pipe';

@NgModule({
    imports: [RouterModule, CustomMaterialModule, ReactiveFormsModule, ConfirmDialogComponent,
        ContentPlaceholderAnimationComponent,
        LimitToPipe,
        LocalDatePipe,
        YesNoPipe,
        LayoutComponent],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        CustomMaterialModule,
        LimitToPipe,
        ConfirmDialogComponent,
        ContentPlaceholderAnimationComponent,
        LocalDatePipe,
        YesNoPipe,
    ],
})
export class SharedModule {
}

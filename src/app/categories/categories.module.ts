import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import {CategoryDetailComponent} from './category-detail/category-detail.component';
import {CategoriesRoutingModule} from './categories-routing.module';
import {CategoryListComponent} from './category-list/category-list.component';

@NgModule({
    imports: [CommonModule, CategoriesRoutingModule, SharedModule, CategoryDetailComponent, CategoryListComponent],
})
export class CategoriesModule {
}

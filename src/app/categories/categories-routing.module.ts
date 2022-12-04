import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LayoutComponent} from '../shared/layout/layout.component';
import {CategoryListComponent} from './category-list/category-list.component';
import {CategoryDetailComponent} from './category-detail/category-detail.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {path: '', component: CategoryListComponent},
      {path: 'detail', component: CategoryDetailComponent},
      {path: 'detail/:id', component: CategoryDetailComponent}
    ],
  },
];

@NgModule({imports: [RouterModule.forChild(routes)], exports: [RouterModule]})
export class CategoriesRoutingModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {AuthGuard} from './core/guards/auth.guard';

const appRoutes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'balances',
    loadChildren: () => import('./balances/balances.module').then((m) => m.BalancesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'transactions',
    loadChildren: () => import('./transactions/transactions.module').then((m) => m.TransactionsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'accounts',
    loadChildren: () => import('./accounts/accounts.module').then((m) => m.AccountsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then((m) => m.CategoriesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'payees',
    loadChildren: () => import('./payees/payees.module').then((m) => m.PayeesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then((m) => m.AboutModule),
    canActivate: [AuthGuard],
  },
  {path: '**', redirectTo: 'dashboard', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {
}

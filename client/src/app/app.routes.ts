import { Routes } from '@angular/router';
import {CustomersComponent} from './components/customers/customers.component';
import {AccountsComponent} from './components/accounts/accounts.component';
import {OperationsComponent} from './components/operations/operations.component';
import {LoginComponent} from './components/auth/login/login.component';
import {AdminComponent} from './components/admin/admin.component';
import {authenticationGuard} from './core/guards/authentication.guard';
import {authorizationGuard} from './core/guards/authorization.guard';
import {NotAuthorizedComponent} from './components/not-authorized/not-authorized.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authenticationGuard ],
    children: [
      {
        path: "customers",
        component: CustomersComponent
      },
      {
        path: 'accounts',
        component: AccountsComponent
      },
      {
        path: 'accounts/customer/:customerId',
        component: AccountsComponent
      },
      {
        path: "operations/account/:accountId",
        component: OperationsComponent,
        canActivate: [authorizationGuard],
        data: {role: 'ADMIN'}
      },
    ]
  },
  {
    path: 'not-authorized',
    component: NotAuthorizedComponent
  }
];

import { Routes } from '@angular/router';
import { Dashboard } from './pages/authorized/dashboard/dashboard';
import { Signup } from './pages/unauthorized/signup/signup';
import { Login } from './pages/unauthorized/login/login';
import { Authorized } from './pages/authorized/authorized';
import { authGuard } from './shared/guards';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        children: []
    },
    {
        path: 'unauthorized',
        children: [
            {
                path: 'login',
                component: Login
            },
            {
                path: 'signup',
                component: Signup
            }
        ]
    },
    {
        path: 'authorized',
        component: Authorized,
        children: [
            {
                path: 'dashboard',
                component: Dashboard
            }
        ]
    }
];

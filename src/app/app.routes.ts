import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./features/auth/login-modal/login-modal.component').then(m => m.LoginModalComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/auth/register-modal/register-modal.component').then(m => m.RegisterModalComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];

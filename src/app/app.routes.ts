import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
        path: 'favorites',
        loadComponent: () => import('./features/favorites/favorites.component').then(m => m.FavoritesComponent),
        canActivate: [authGuard]
    },
    {
        path: 'applications',
        loadComponent: () => import('./features/applications/applications.component').then(m => m.ApplicationsComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: '',
        loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];

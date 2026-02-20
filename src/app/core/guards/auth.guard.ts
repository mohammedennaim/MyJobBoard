import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const notificationService = inject(NotificationService);

    if (authService.isAuthenticated()) {
        return true;
    }

    notificationService.showError('Connectez-vous pour accéder à cette page.');
    router.navigate(['/']);
    return false;
};

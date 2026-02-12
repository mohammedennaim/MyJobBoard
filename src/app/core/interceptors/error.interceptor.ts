import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

const ERROR_MESSAGES: Record<number, string> = {
    0: 'Impossible de se connecter au serveur. Vérifiez que JSON Server est en cours d\'exécution.',
    400: 'Requête invalide',
    401: 'Non autorisé',
    403: 'Accès refusé',
    404: 'Ressource non trouvée',
    500: 'Erreur serveur interne'
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            const errorMessage = error.error instanceof ErrorEvent
                ? error.error.message
                : ERROR_MESSAGES[error.status] || `Erreur: ${error.message}`;

            if (error.status === 401) {
                router.navigate(['/auth/login']);
            }

            console.error('HTTP Error:', errorMessage, error);
            return throwError(() => new Error(errorMessage));
        })
    );
};

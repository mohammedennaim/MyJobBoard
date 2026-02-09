import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'Une erreur est survenue';

            if (error.error instanceof ErrorEvent) {
                errorMessage = error.error.message;
            } else {
                switch (error.status) {
                    case 0:
                        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que JSON Server est en cours d\'exécution.';
                        break;
                    case 400:
                        errorMessage = 'Requête invalide';
                        break;
                    case 401:
                        errorMessage = 'Non autorisé';
                        router.navigate(['/auth/login']);
                        break;
                    case 403:
                        errorMessage = 'Accès refusé';
                        break;
                    case 404:
                        errorMessage = 'Ressource non trouvée';
                        break;
                    case 500:
                        errorMessage = 'Erreur serveur interne';
                        break;
                    default:
                        errorMessage = `Erreur: ${error.message}`;
                }
            }

            console.error('HTTP Error:', errorMessage, error);
            return throwError(() => new Error(errorMessage));
        })
    );
};

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Application } from '../../shared/models/application';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private apiUrl = `${environment.jsonServerUrl}/applications`;

    constructor(private http: HttpClient) { }

    getApplicationsByUser(userId: number): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addApplication(application: Application): Observable<Application> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${application.userId}&offerId=${application.offerId}`).pipe(
            switchMap(existing => {
                if (existing.length > 0) {
                    return throwError(() => new Error('Candidature déjà existante'));
                }
                return this.http.post<Application>(this.apiUrl, application);
            }),
            catchError(error => throwError(() => error))
        );
    }

    updateApplicationStatus(id: number, status: string): Observable<Application> {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
    }

    deleteApplication(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Application } from '../../shared/models/application';
import { Job } from '../../shared/models/job.model';

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

    trackJob(job: Job, userId: number): Observable<Application> {
        const application: Application = {
            userId: userId,
            offerId: String(job.id),
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            url: job.redirect_url,
            status: 'en_attente',
            dateAdded: new Date().toISOString(),
            description: job.description,
            contract_time: job.contract_time,
            contract_type: job.contract_type,
            salary_min: job.salary_min,
            salary_max: job.salary_max
        };
        return this.addApplication(application);
    }
}

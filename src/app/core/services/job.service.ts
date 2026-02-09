import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Job, AdzunaResponse } from '../../shared/models/job.model';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private appId = environment.adzuna.appId;
    private appKey = environment.adzuna.appKey;
    private apiUrl = environment.adzuna.apiUrl;

    constructor(private http: HttpClient) { }

    searchJobs(keyword?: string, location?: string, page: number = 1): Observable<Job[]> {
        const country = 'fr';
        const url = `${this.apiUrl}/jobs/${country}/search/${page}`;

        let params = new HttpParams()
            .set('app_id', this.appId)
            .set('app_key', this.appKey)
            .set('results_per_page', '10')
            .set('content-type', 'application/json');

        if (keyword) {
            params = params.set('what', keyword);
        }

        if (location) {
            params = params.set('where', location);
        }

        return this.http.get<AdzunaResponse>(url, { params }).pipe(
            map(response => response.results),
            catchError(error => {
                console.error('Error fetching jobs from Adzuna:', error);
                return of([]);
            })
        );
    }
}

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

    searchJobs(keyword?: string, location?: string, page: number = 1, resultsPerPage: number = 6, sortBy: string = 'date'): Observable<{ jobs: Job[], totalCount: number }> {
        let params = this.buildBaseParams(resultsPerPage, sortBy);

        if (keyword) {
            params = params.set('title_only', keyword);
        }
        if (location) {
            params = params.set('where', location);
        }

        return this.fetchJobs(page, params);
    }

    getAllJobs(page: number = 1, resultsPerPage: number = 6, sortBy: string = 'date'): Observable<{ jobs: Job[], totalCount: number }> {
        return this.fetchJobs(page, this.buildBaseParams(resultsPerPage, sortBy));
    }

    private buildBaseParams(resultsPerPage: number, sortBy: string = 'date'): HttpParams {
        let params = new HttpParams()
            .set('app_id', this.appId)
            .set('app_key', this.appKey)
            .set('results_per_page', resultsPerPage.toString())
            .set('content-type', 'application/json');

        if (sortBy) {
            params = params.set('sort_by', sortBy);
        }

        return params;
    }

    private fetchJobs(page: number, params: HttpParams): Observable<{ jobs: Job[], totalCount: number }> {
        const url = `${this.apiUrl}/jobs/fr/search/${page}`;

        return this.http.get<AdzunaResponse>(url, { params }).pipe(
            map(response => ({
                jobs: response.results,
                totalCount: response.count || 0
            })),
            catchError(error => {
                console.error('Error fetching jobs from Adzuna:', error);
                return of({ jobs: [], totalCount: 0 });
            })
        );
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Favorite } from '../../shared/models/favorite';

@Injectable({
    providedIn: 'root'
})
export class FavoriteService {
    private apiUrl = `${environment.jsonServerUrl}/favorites`;

    constructor(private http: HttpClient) {}

    getFavoritesByUser(userId: number): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addFavorite(favorite: Favorite): Observable<Favorite> {
        return this.http.post<Favorite>(this.apiUrl, favorite);
    }

    removeFavorite(favoriteId: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${favoriteId}`);
    }
}

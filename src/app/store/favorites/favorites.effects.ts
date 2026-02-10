import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Favorite } from '../../shared/models/favorite';
import * as FavoritesActions from './favorites.action';

@Injectable()
export class FavoritesEffects {
    private actions$ = inject(Actions);
    private http = inject(HttpClient);
    private apiUrl = `${environment.jsonServerUrl}/favorites`;

    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            mergeMap(({ userId }) =>
                this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`).pipe(
                    map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError(error => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
                )
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            mergeMap(({ favorite }) =>
                this.http.post<Favorite>(this.apiUrl, favorite).pipe(
                    map(created => FavoritesActions.addFavoriteSuccess({ favorite: created })),
                    catchError(error => of(FavoritesActions.addFavoriteFailure({ error: error.message })))
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            mergeMap(({ favoriteId }) =>
                this.http.delete(`${this.apiUrl}/${favoriteId}`).pipe(
                    map(() => FavoritesActions.removeFavoriteSuccess({ favoriteId })),
                    catchError(error => of(FavoritesActions.removeFavoriteFailure({ error: error.message })))
                )
            )
        )
    );
}

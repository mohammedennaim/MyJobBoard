import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, switchMap, catchError } from 'rxjs/operators';
import { FavoriteService } from '../../core/services/favorite.service';
import * as FavoritesActions from './favorites.action';

@Injectable()
export class FavoritesEffects {
    private actions$ = inject(Actions);
    private favoriteService = inject(FavoriteService);

    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            switchMap(({ userId }) =>
                this.favoriteService.getFavoritesByUser(userId).pipe(
                    map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError(error => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
                )
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            switchMap(({ favorite }) =>
                this.favoriteService.addFavorite(favorite).pipe(
                    map(created => FavoritesActions.addFavoriteSuccess({ favorite: created })),
                    catchError(error => of(FavoritesActions.addFavoriteFailure({ error: error.message })))
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            switchMap(({ favoriteId }) =>
                this.favoriteService.removeFavorite(favoriteId).pipe(
                    map(() => FavoritesActions.removeFavoriteSuccess({ favoriteId })),
                    catchError(error => of(FavoritesActions.removeFavoriteFailure({ error: error.message })))
                )
            )
        )
    );
}

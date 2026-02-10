import { createReducer, on } from '@ngrx/store';
import { Favorite } from '../../shared/models/favorite';
import * as FavoritesActions from './favorites.action';

export interface FavoritesState {
    favorites: Favorite[];
    loading: boolean;
    error: string | null;
}

export const initialState: FavoritesState = {
    favorites: [],
    loading: false,
    error: null
};

export const favoritesReducer = createReducer(
    initialState,

    // Load
    on(FavoritesActions.loadFavorites, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
        ...state,
        favorites,
        loading: false
    })),
    on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Add
    on(FavoritesActions.addFavorite, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(FavoritesActions.addFavoriteSuccess, (state, { favorite }) => ({
        ...state,
        favorites: [...state.favorites, favorite],
        loading: false
    })),
    on(FavoritesActions.addFavoriteFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    // Remove
    on(FavoritesActions.removeFavorite, (state) => ({
        ...state,
        loading: true,
        error: null
    })),
    on(FavoritesActions.removeFavoriteSuccess, (state, { favoriteId }) => ({
        ...state,
        favorites: state.favorites.filter(f => f.id !== favoriteId),
        loading: false
    })),
    on(FavoritesActions.removeFavoriteFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    }))
);

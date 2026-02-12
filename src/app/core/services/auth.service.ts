import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { User, AuthUser } from '../../shared/models';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly STORAGE_KEY = 'jobfinder_user';
    private currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
    public currentUser$ = this.currentUserSubject.asObservable();

    constructor(private http: HttpClient) { }

    private getStoredUser(): AuthUser | null {
        const userJson = localStorage.getItem(this.STORAGE_KEY);
        return userJson ? JSON.parse(userJson) : null;
    }

    private storeUser(user: AuthUser): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    private removeStoredUser(): void {
        localStorage.removeItem(this.STORAGE_KEY);
        this.currentUserSubject.next(null);
    }

    register(user: User): Observable<AuthUser> {
        return this.http.get<User[]>(`${environment.jsonServerUrl}/users?email=${user.email}`).pipe(
            switchMap(users => {
                if (users.length > 0) {
                    return throwError(() => new Error('Un compte avec cet email existe déjà'));
                }
                return this.http.post<User>(`${environment.jsonServerUrl}/users`, user);
            }),
            map(createdUser => ({
                id: createdUser.id!,
                firstName: createdUser.firstName,
                lastName: createdUser.lastName,
                email: createdUser.email
            })),
            catchError(error => throwError(() => error))
        );
    }

    login(email: string, password: string): Observable<AuthUser> {
        return this.http.get<User[]>(`${environment.jsonServerUrl}/users?email=${email}`).pipe(
            map(users => {
                if (users.length === 0) {
                    throw new Error('Email ou mot de passe incorrect');
                }

                const user = users[0];
                if (user.password !== password) {
                    throw new Error('Email ou mot de passe incorrect');
                }

                const authUser: AuthUser = {
                    id: user.id!,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                };

                this.storeUser(authUser);
                return authUser;
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    logout(): void {
        this.removeStoredUser();
    }

    getCurrentUser(): AuthUser | null {
        return this.currentUserSubject.value;
    }

    isAuthenticated(): boolean {
        return this.currentUserSubject.value !== null;
    }

    updateProfile(userId: number, updates: Partial<User>): Observable<AuthUser> {
        return this.http.patch<User>(`${environment.jsonServerUrl}/users/${userId}`, updates).pipe(
            map(updatedUser => {
                const authUser: AuthUser = {
                    id: updatedUser.id!,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    email: updatedUser.email
                };
                this.storeUser(authUser);
                return authUser;
            }),
            catchError(error => throwError(() => error))
        );
    }

    deleteAccount(userId: number): Observable<void> {
        return this.http.delete<void>(`${environment.jsonServerUrl}/users/${userId}`).pipe(
            map(() => {
                this.removeStoredUser();
            }),
            catchError(error => throwError(() => error))
        );
    }
}

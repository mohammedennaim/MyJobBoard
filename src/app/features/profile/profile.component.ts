import { Component, OnDestroy } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { AuthUser } from '../../shared/models/user.model';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [RouterModule, ReactiveFormsModule],
    templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnDestroy {
    profileForm: FormGroup;
    passwordForm: FormGroup;
    currentUser: AuthUser | null;
    isLoading = false;
    isPasswordLoading = false;
    successMessage = '';
    errorMessage = '';
    passwordSuccess = '';
    passwordError = '';
    showDeleteConfirm = false;

    private destroy$ = new Subject<void>();

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.currentUser = this.authService.getCurrentUser();

        this.profileForm = this.fb.group({
            firstName: [this.currentUser?.firstName || '', [Validators.required, Validators.minLength(2)]],
            lastName: [this.currentUser?.lastName || '', [Validators.required, Validators.minLength(2)]],
            email: [this.currentUser?.email || '', [Validators.required, Validators.email]]
        });

        this.passwordForm = this.fb.group({
            currentPassword: ['', [Validators.required]],
            newPassword: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onUpdateProfile(): void {
        if (this.profileForm.invalid || !this.currentUser) return;

        this.isLoading = true;
        this.successMessage = '';
        this.errorMessage = '';

        const { firstName, lastName, email } = this.profileForm.value;

        this.authService.updateProfile(this.currentUser.id, { firstName, lastName, email })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedUser: AuthUser) => {
                    this.currentUser = updatedUser;
                    this.isLoading = false;
                    this.successMessage = 'Profil mis à jour avec succès !';
                    setTimeout(() => this.successMessage = '', 3000);
                },
                error: (err: Error) => {
                    this.isLoading = false;
                    this.errorMessage = err.message || 'Erreur lors de la mise à jour.';
                }
            });
    }

    onUpdatePassword(): void {
        if (this.passwordForm.invalid || !this.currentUser) return;

        const { newPassword, confirmPassword } = this.passwordForm.value;

        if (newPassword !== confirmPassword) {
            this.passwordError = 'Les mots de passe ne correspondent pas.';
            return;
        }

        this.isPasswordLoading = true;
        this.passwordSuccess = '';
        this.passwordError = '';

        this.authService.updateProfile(this.currentUser.id, { password: newPassword })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.isPasswordLoading = false;
                    this.passwordSuccess = 'Mot de passe mis à jour avec succès !';
                    this.passwordForm.reset();
                    setTimeout(() => this.passwordSuccess = '', 3000);
                },
                error: (err: Error) => {
                    this.isPasswordLoading = false;
                    this.passwordError = err.message || 'Erreur lors de la mise à jour.';
                }
            });
    }

    onDeleteAccount(): void {
        if (!this.currentUser) return;

        this.authService.deleteAccount(this.currentUser.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate(['/']);
                },
                error: (err: Error) => {
                    this.errorMessage = err.message || 'Erreur lors de la suppression.';
                }
            });
    }

    toggleDeleteConfirm(): void {
        this.showDeleteConfirm = !this.showDeleteConfirm;
    }
}

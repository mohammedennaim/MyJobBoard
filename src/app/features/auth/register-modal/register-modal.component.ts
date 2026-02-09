import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register-modal.component.html'
})
export class RegisterModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() switchToLogin = new EventEmitter<void>();

    authForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.authForm = this.fb.group({
            firstName: ['', [Validators.required, Validators.minLength(2)]],
            lastName: ['', [Validators.required, Validators.minLength(2)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        });
    }

    onClose(): void {
        this.close.emit();
    }

    onSwitchToLogin(): void {
        this.switchToLogin.emit();
    }

    onSubmit(): void {
        if (this.authForm.invalid) return;

        if (this.authForm.value.password !== this.authForm.value.confirmPassword) {
            this.errorMessage = 'Passwords do not match';
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';
        const { firstName, lastName, email, password } = this.authForm.value;

        this.authService.register({ firstName, lastName, email, password }).subscribe({
            next: () => {
                this.isLoading = false;
                // Optionally auto-login or switch to login
                this.switchToLogin.emit();
                // Or confirm success
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.message || 'Registration failed';
            }
        });
    }
}

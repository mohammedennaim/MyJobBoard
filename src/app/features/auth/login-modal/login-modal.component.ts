import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-login-modal',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login-modal.component.html'
})
export class LoginModalComponent {
    @Output() close = new EventEmitter<void>();
    @Output() switchToRegister = new EventEmitter<void>();

    authForm: FormGroup;
    isLoading = false;
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.authForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]]
        });
    }

    onClose(): void {
        this.close.emit();
    }

    onSwitchToRegister(): void {
        this.switchToRegister.emit();
    }

    onSubmit(): void {
        if (this.authForm.invalid) return;

        this.isLoading = true;
        this.errorMessage = '';
        const { email, password } = this.authForm.value;

        this.authService.login(email, password).subscribe({
            next: () => {
                this.isLoading = false;
                this.close.emit();
            },
            error: (err) => {
                this.isLoading = false;
                this.errorMessage = err.message || 'Login failed';
            }
        });
    }
}

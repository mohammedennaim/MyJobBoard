import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() openAuth = new EventEmitter<void>();

  currentUser$: Observable<User | null>;
  favoritesCount$: Observable<number> = of(0); // Mocked
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  logout(): void {
    this.authService.logout();
  }

  onOpenAuth(): void {
    this.openAuth.emit();
  }
}

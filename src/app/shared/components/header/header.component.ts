import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';
import { selectFavoritesCount } from '../../../store/favorites/favorites.selectors';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() openAuth = new EventEmitter<void>();

  currentUser$: Observable<User | null>;
  favoritesCount$: Observable<number>;
  isMobileMenuOpen = false;

  constructor(
    private authService: AuthService,
    private store: Store
  ) {
    this.currentUser$ = this.authService.currentUser$;
    this.favoritesCount$ = this.store.select(selectFavoritesCount);
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

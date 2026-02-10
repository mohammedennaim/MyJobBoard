import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoginModalComponent } from './features/auth/login-modal/login-modal.component';
import { RegisterModalComponent } from './features/auth/register-modal/register-modal.component';
import { AuthService } from './core/services/auth.service';
import { loadFavorites } from './store/favorites/favorites.action';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    LoginModalComponent,
    RegisterModalComponent
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  showLoginModal = false;
  showRegisterModal = false;

  constructor(
    private authService: AuthService,
    private store: Store
  ) { }

  ngOnInit() {
    this.showLoginModal = false;
    this.showRegisterModal = false;

    // Load favorites when user is authenticated
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.store.dispatch(loadFavorites({ userId: user.id }));
      }
    });
  }

  onSwitchToRegister() {
    this.showLoginModal = false;
    this.showRegisterModal = true;
  }

  onSwitchToLogin() {
    this.showRegisterModal = false;
    this.showLoginModal = true;
  }
}

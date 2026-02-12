import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HeaderComponent } from './shared/components/header/header.component';
import { LoginModalComponent } from './features/auth/login-modal/login-modal.component';
import { RegisterModalComponent } from './features/auth/register-modal/register-modal.component';
import { AuthService } from './core/services/auth.service';
import { ModalService } from './core/services/modal.service';
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
export class AppComponent implements OnInit, OnDestroy {
  showLoginModal = false;
  showRegisterModal = false;

  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private modalService: ModalService,
    private store: Store
  ) { }

  ngOnInit() {
    this.modalService.loginModal$
      .pipe(takeUntil(this.destroy$))
      .subscribe(show => this.showLoginModal = show);

    this.modalService.registerModal$
      .pipe(takeUntil(this.destroy$))
      .subscribe(show => this.showRegisterModal = show);

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.store.dispatch(loadFavorites({ userId: user.id }));
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSwitchToRegister() {
    this.modalService.switchToRegister();
  }

  onSwitchToLogin() {
    this.modalService.switchToLogin();
  }

  onCloseLogin() {
    this.modalService.closeLogin();
  }

  onCloseRegister() {
    this.modalService.closeRegister();
  }

  onOpenAuth() {
    this.modalService.openLogin();
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private loginModalSubject = new BehaviorSubject<boolean>(false);
    private registerModalSubject = new BehaviorSubject<boolean>(false);

    loginModal$ = this.loginModalSubject.asObservable();
    registerModal$ = this.registerModalSubject.asObservable();

    openLogin(): void {
        this.loginModalSubject.next(true);
    }

    closeLogin(): void {
        this.loginModalSubject.next(false);
    }

    openRegister(): void {
        this.registerModalSubject.next(true);
    }

    closeRegister(): void {
        this.registerModalSubject.next(false);
    }

    switchToRegister(): void {
        this.closeLogin();
        this.openRegister();
    }

    switchToLogin(): void {
        this.closeRegister();
        this.openLogin();
    }
}

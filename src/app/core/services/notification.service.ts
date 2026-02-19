import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
    message: string;
    type: 'success' | 'error';
}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private notificationSubject = new BehaviorSubject<Notification | null>(null);
    notification$ = this.notificationSubject.asObservable();

    showSuccess(message: string): void {
        this.show({ message, type: 'success' });
    }

    showError(message: string): void {
        this.show({ message, type: 'error' });
    }

    private show(notification: Notification): void {
        this.notificationSubject.next(notification);
        setTimeout(() => this.notificationSubject.next(null), 4000);
    }
}

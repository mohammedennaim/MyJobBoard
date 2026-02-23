import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './notification.component.html',
    styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {
    notification: Notification | null = null;
    private destroy$ = new Subject<void>();

    constructor(private notificationService: NotificationService) { }

    ngOnInit(): void {
        this.notificationService.notification$
            .pipe(takeUntil(this.destroy$))
            .subscribe(n => this.notification = n);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}

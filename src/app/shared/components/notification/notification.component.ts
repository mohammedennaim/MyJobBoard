import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (notification) {
        <div class="fixed top-4 right-4 z-50 animate-slide-in">
            <div class="flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border"
                [class]="notification.type === 'success'
                    ? 'bg-green-50 text-green-800 border-green-200'
                    : 'bg-red-50 text-red-800 border-red-200'">
                <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (notification.type === 'success') {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M5 13l4 4L19 7" />
                    } @else {
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    }
                </svg>
                <span class="text-sm font-medium">{{ notification.message }}</span>
            </div>
        </div>
        }
    `,
    styles: [`
        .animate-slide-in {
            animation: slideIn 0.3s ease-out;
        }
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
    `]
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

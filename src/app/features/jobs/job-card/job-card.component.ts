import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Job } from '../../../shared/models/job.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-job-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './job-card.component.html'
})
export class JobCardComponent implements OnInit {
    @Input({ required: true }) job!: Job;
    @Output() trackApplication = new EventEmitter<Job>();

    isFavorited$: Observable<boolean> = of(false); // Mocked for now
    isAuthenticated = false;

    constructor(
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        // Check if authService has isAuthenticated method, if not assume false or use observable
        // Based on previous checks, AuthService likely has currentUser$
        this.authService.currentUser$.subscribe(user => {
            this.isAuthenticated = !!user;
        });
    }

    onToggleFavorite(): void {
        console.log('Toggle favorite', this.job.id);
        // TODO: Implement favorite service logic later
    }

    onTrackApplication(): void {
        this.trackApplication.emit(this.job);
    }

    truncateDescription(description: string): string {
        if (!description) return '';
        const text = description.replace(/<[^>]*>/g, '');
        return text.length > 150 ? text.substring(0, 150) + '...' : text;
    }

    formatDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Aujourd'hui";
        if (diffDays === 1) return 'Hier';
        if (diffDays < 7) return `Il y a ${diffDays} jours`;
        if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}

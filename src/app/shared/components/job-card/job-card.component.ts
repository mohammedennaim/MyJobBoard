import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, of, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import { Job } from '../../models/job.model';
import { Favorite } from '../../models/favorite';
import { AuthService } from '../../../core/services/auth.service';
import { selectIsFavorited, selectFavoriteByOfferId } from '../../../store/favorites/favorites.selectors';
import * as FavoritesActions from '../../../store/favorites/favorites.action';

@Component({
    selector: 'app-job-card',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './job-card.component.html'
})
export class JobCardComponent implements OnInit, OnDestroy {
    @Input({ required: true }) job!: Job;
    @Input() showStatusSelect = false;
    @Input() applicationStatus = 'en_attente';
    @Output() trackApplication = new EventEmitter<Job>();
    @Output() statusChange = new EventEmitter<{ job: Job; status: string }>();
    @Output() deleteApplication = new EventEmitter<Job>();

    isFavorited$: Observable<boolean> = of(false);
    isAuthenticated = false;

    private destroy$ = new Subject<void>();

    constructor(
        private authService: AuthService,
        private store: Store
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$
            .pipe(takeUntil(this.destroy$))
            .subscribe(user => {
                this.isAuthenticated = !!user;
            });
        this.updateFavoritedState();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private updateFavoritedState(): void {
        if (this.job) {
            this.isFavorited$ = this.store.select(selectIsFavorited(this.job.id));
        }
    }

    onToggleFavorite(): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.store.select(selectFavoriteByOfferId(this.job.id))
            .pipe(take(1))
            .subscribe(existing => {
                if (existing?.id) {
                    this.store.dispatch(FavoritesActions.removeFavorite({ favoriteId: existing.id }));
                } else {
                    const favorite: Favorite = {
                        userId: user.id,
                        offerId: this.job.id,
                        title: this.job.title,
                        company: this.job.company.display_name,
                        location: this.job.location.display_name,
                        url: this.job.redirect_url,
                        dateAdded: new Date().toISOString(),
                        description: this.job.description,
                        contract_time: this.job.contract_time,
                        contract_type: this.job.contract_type,
                        salary_min: this.job.salary_min,
                        salary_max: this.job.salary_max
                    };
                    this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
                }
            });
    }

    onTrackApplication(): void {
        this.trackApplication.emit(this.job);
    }

    onStatusChange(status: string): void {
        this.statusChange.emit({ job: this.job, status });
    }

    onDeleteApplication(): void {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette candidature ?')) {
            this.deleteApplication.emit(this.job);
        }
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

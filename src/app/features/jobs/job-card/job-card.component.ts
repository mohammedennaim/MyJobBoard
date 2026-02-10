import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Job } from '../../../shared/models/job.model';
import { Favorite } from '../../../shared/models/favorite';
import { AuthService } from '../../../core/services/auth.service';
import { selectIsFavorited, selectFavoriteByOfferId } from '../../../store/favorites/favorites.selectors';
import * as FavoritesActions from '../../../store/favorites/favorites.action';

@Component({
    selector: 'app-job-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './job-card.component.html'
})
export class JobCardComponent implements OnInit, OnChanges {
    @Input({ required: true }) job!: Job;
    @Output() trackApplication = new EventEmitter<Job>();

    isFavorited$: Observable<boolean> = of(false);
    isAuthenticated = false;

    constructor(
        private authService: AuthService,
        private store: Store
    ) { }

    ngOnInit(): void {
        this.authService.currentUser$.subscribe(user => {
            this.isAuthenticated = !!user;
        });
        this.updateFavoritedState();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['job']) {
            this.updateFavoritedState();
        }
    }

    private updateFavoritedState(): void {
        if (this.job) {
            this.isFavorited$ = this.store.select(selectIsFavorited(this.job.id));
        }
    }

    onToggleFavorite(): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.store.select(selectFavoriteByOfferId(this.job.id)).subscribe(existing => {
            if (existing && existing.id) {
                this.store.dispatch(FavoritesActions.removeFavorite({ favoriteId: existing.id }));
            } else {
                const favorite: Favorite = {
                    userId: user.id,
                    offerId: this.job.id,
                    title: this.job.title,
                    company: this.job.company.display_name,
                    location: this.job.location.display_name,
                    url: this.job.redirect_url,
                    dateAdded: new Date().toISOString()
                };
                this.store.dispatch(FavoritesActions.addFavorite({ favorite }));
            }
        }).unsubscribe();
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

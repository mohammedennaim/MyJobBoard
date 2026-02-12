import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Job } from '../../shared/models/job.model';
import { Favorite } from '../../shared/models/favorite';
import { JobCardComponent } from '../jobs/job-card/job-card.component';
import { selectAllFavorites } from '../../store/favorites/favorites.selectors';
import { loadFavorites } from '../../store/favorites/favorites.action';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, JobCardComponent],
    templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit, OnDestroy {
    favorites$: Observable<Job[]>;
    private destroy$ = new Subject<void>();

    constructor(
        private store: Store,
        private authService: AuthService
    ) {
        this.favorites$ = this.store.select(selectAllFavorites).pipe(
            map(favorites => favorites.map(this.mapFavoriteToJob))
        );
    }

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.store.dispatch(loadFavorites({ userId: user.id }));
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private mapFavoriteToJob(favorite: Favorite): Job {
        return {
            id: favorite.offerId,
            title: favorite.title,
            company: {
                display_name: favorite.company
            },
            location: {
                display_name: favorite.location
            },
            description: '',
            redirect_url: favorite.url,
            created: favorite.dateAdded,
            category: {
                label: 'Saved',
                tag: 'saved'
            }
        };
    }

    onTrackApplication(job: Job): void {
        console.log('Track application from favorites:', job);
    }
}

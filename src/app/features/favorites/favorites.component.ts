import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Job } from '../../shared/models/job.model';
import { Favorite } from '../../shared/models/favorite';
import { JobCardComponent } from '../jobs/job-card/job-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { selectAllFavorites } from '../../store/favorites/favorites.selectors';
import { loadFavorites } from '../../store/favorites/favorites.action';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, RouterModule, JobCardComponent, SearchBarComponent],
    templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit, OnDestroy {
    favorites$: Observable<Job[]>;
    filteredFavorites$: Observable<Job[]>;
    private destroy$ = new Subject<void>();
    private allFavorites: Job[] = [];

    constructor(
        private store: Store,
        private authService: AuthService
    ) {
        this.favorites$ = this.store.select(selectAllFavorites).pipe(
            map(favorites => favorites.map(this.mapFavoriteToJob))
        );
        this.filteredFavorites$ = this.favorites$;
    }

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.store.dispatch(loadFavorites({ userId: user.id }));
        }

        this.favorites$.pipe(takeUntil(this.destroy$)).subscribe(jobs => {
            this.allFavorites = jobs;
        });
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
            description: favorite.description || '',
            redirect_url: favorite.url,
            created: favorite.dateAdded,
            contract_time: favorite.contract_time,
            contract_type: favorite.contract_type,
            salary_min: favorite.salary_min,
            salary_max: favorite.salary_max,
            category: {
                label: 'Saved',
                tag: 'saved'
            }
        };
    }

    onTrackApplication(job: Job): void {
        console.log('Track application from favorites:', job);
    }

    onSearch(filters: { keyword: string; location: string }): void {
        const keyword = filters.keyword.toLowerCase().trim();
        const location = filters.location.toLowerCase().trim();

        if (!keyword && !location) {
            this.filteredFavorites$ = this.favorites$;
            return;
        }

        this.filteredFavorites$ = this.favorites$.pipe(
            map(jobs => jobs.filter(job => {
                const matchKeyword = !keyword ||
                    job.title.toLowerCase().includes(keyword) ||
                    job.company.display_name.toLowerCase().includes(keyword);

                const matchLocation = !location ||
                    job.location.display_name.toLowerCase().includes(location);

                return matchKeyword && matchLocation;
            }))
        );
    }
}

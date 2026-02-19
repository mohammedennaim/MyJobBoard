import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Job } from '../../shared/models/job.model';
import { Favorite } from '../../shared/models/favorite';
import { JobCardComponent } from '../../shared/components/job-card/job-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { selectAllFavorites } from '../../store/favorites/favorites.selectors';
import { loadFavorites } from '../../store/favorites/favorites.action';
import { AuthService } from '../../core/services/auth.service';
import { ApplicationService } from '../../core/services/application.service';
import { PaginationService } from '../../core/services/pagination.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, RouterModule, JobCardComponent, SearchBarComponent, PaginationComponent],
    templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    private allFavorites: Job[] = [];
    filteredList: Job[] = [];

    currentPage = 1;
    itemsPerPage = 6;
    paginatedFavorites: Job[] = [];
    totalPages = 0;
    visiblePages: number[] = [];

    constructor(
        private store: Store,
        private authService: AuthService,
        private applicationService: ApplicationService,
        private paginationService: PaginationService
    ) { }

    ngOnInit(): void {
        const user = this.authService.getCurrentUser();
        if (user) {
            this.store.dispatch(loadFavorites({ userId: user.id }));
        }

        this.store.select(selectAllFavorites).pipe(
            map(favorites => favorites.map(this.mapFavoriteToJob)),
            takeUntil(this.destroy$)
        ).subscribe(jobs => {
            this.allFavorites = jobs;
            this.filteredList = jobs;
            this.currentPage = 1;
            this.updatePagination();
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    updatePagination(): void {
        this.totalPages = this.paginationService.calculateTotalPages(this.filteredList.length, this.itemsPerPage);
        this.visiblePages = this.paginationService.getVisiblePages(this.currentPage, this.totalPages);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        this.paginatedFavorites = this.filteredList.slice(startIndex, startIndex + this.itemsPerPage);
    }

    goToPage(page: number): void {
        if (this.paginationService.isValidPage(page, this.totalPages)) {
            this.currentPage = page;
            this.updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
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
            salary_max: favorite.salary_max
        };
    }

    onTrackApplication(job: Job): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.applicationService.trackJob(job, user.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => alert('Candidature ajoutée avec succès !'),
                error: (err: Error) => alert(err.message || 'Erreur lors de l\'ajout.')
            });
    }

    onSearch(filters: { keyword: string; location: string }): void {
        const keyword = filters.keyword.toLowerCase().trim();
        const location = filters.location.toLowerCase().trim();

        if (!keyword && !location) {
            this.filteredList = this.allFavorites;
        } else {
            this.filteredList = this.allFavorites.filter(job => {
                const matchKeyword = !keyword ||
                    job.title.toLowerCase().includes(keyword);

                const matchLocation = !location ||
                    job.location.display_name.toLowerCase().includes(location);

                return matchKeyword && matchLocation;
            });
        }

        this.currentPage = 1;
        this.updatePagination();
    }
}

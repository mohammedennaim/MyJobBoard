import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../shared/models/job.model';
import { JobCardComponent } from '../../shared/components/job-card/job-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { AuthService } from '../../core/services/auth.service';
import { ModalService } from '../../core/services/modal.service';
import { PaginationService } from '../../core/services/pagination.service';
import { ApplicationService } from '../../core/services/application.service';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        JobCardComponent,
        SearchBarComponent,
        PaginationComponent
    ],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
    jobs: Job[] = [];
    loading = false;
    error = '';

    currentPage = 1;
    itemsPerPage = 10;
    totalCount = 0;
    currentSort = 'date';

    sortOptions = [
        { value: 'date', label: 'Date (récent)' },
        { value: 'salary', label: 'Salaire' }
    ];

    private destroy$ = new Subject<void>();
    private searchFilters: { keyword: string; location: string } | null = null;

    constructor(
        private jobService: JobService,
        private authService: AuthService,
        private modalService: ModalService,
        private paginationService: PaginationService,
        private applicationService: ApplicationService
    ) { }

    ngOnInit() {
        this.loadJobs();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSearch(filters: { keyword: string; location: string }) {
        this.searchFilters = (filters.keyword || filters.location) ? filters : null;
        this.currentPage = 1;
        this.loadJobs();
    }

    onSortChange(sortValue: string): void {
        this.currentSort = sortValue;
        this.currentPage = 1;
        this.loadJobs();
    }

    private loadJobs(): void {
        this.loading = true;
        this.error = '';

        const request$ = this.searchFilters
            ? this.jobService.searchJobs(
                this.searchFilters.keyword,
                this.searchFilters.location,
                this.currentPage,
                this.itemsPerPage,
                this.currentSort
            )
            : this.jobService.getAllJobs(this.currentPage, this.itemsPerPage, this.currentSort);

        request$.pipe(takeUntil(this.destroy$)).subscribe({
            next: (data) => {
                this.jobs = data.jobs;
                this.totalCount = data.totalCount;
                this.loading = false;
                if (this.currentPage > 1) {
                    this.scrollToResults();
                }
            },
            error: () => {
                this.error = 'Erreur lors du chargement des offres.';
                this.loading = false;
            }
        });
    }

    private scrollToResults(): void {
        const resultsElement = document.getElementById('results-section');
        resultsElement?.scrollIntoView({ behavior: 'smooth' });
    }

    get totalPages(): number {
        return this.paginationService.calculateTotalPages(this.totalCount, this.itemsPerPage);
    }

    get visiblePages(): number[] {
        return this.paginationService.getVisiblePages(this.currentPage, this.totalPages);
    }

    goToPage(page: number): void {
        if (this.paginationService.isValidPage(page, this.totalPages)) {
            this.currentPage = page;
            this.loadJobs();
        }
    }

    onTrackApplication(job: Job) {
        if (!this.authService.isAuthenticated()) {
            this.modalService.openLogin();
            return;
        }

        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.applicationService.trackJob(job, user.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    alert('Candidature ajoutée avec succès !');
                },
                error: (err: Error) => {
                    alert(err.message || 'Erreur lors de l\'ajout de la candidature.');
                }
            });
    }
}

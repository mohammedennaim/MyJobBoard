import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { Application } from '../../shared/models/application';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        JobCardComponent,
        SearchBarComponent
    ],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
    jobs: Job[] = [];
    loading = false;
    error = '';

    currentPage = 1;
    itemsPerPage = 6;
    totalCount = 0;

    private destroy$ = new Subject<void>();
    private searchFilters = { keyword: '', location: '' };

    constructor(
        private jobService: JobService,
        private authService: AuthService,
        private modalService: ModalService,
        private paginationService: PaginationService,
        private applicationService: ApplicationService
    ) { }

    ngOnInit() {
        this.searchJobs();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSearch(filters: { keyword: string; location: string }) {
        this.searchFilters = filters;
        this.currentPage = 1;
        this.searchJobs();
    }

    searchJobs() {
        this.loading = true;
        this.error = '';

        const searchLocation = this.searchFilters.location || 'paris';
        const searchKeyword = this.searchFilters.keyword || 'developer';

        this.jobService.searchJobs(searchKeyword, searchLocation, this.currentPage, this.itemsPerPage)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (data) => {
                    this.jobs = data.jobs;
                    this.totalCount = data.totalCount;
                    this.loading = false;
                    if (this.currentPage > 1) {
                        this.scrollToResults();
                    }
                },
                error: () => {
                    this.error = 'Erreur lors du chargement des jobs.';
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
            this.searchJobs();
        }
    }

    onTrackApplication(job: Job) {
        if (!this.authService.isAuthenticated()) {
            this.modalService.openLogin();
            return;
        }

        const user = this.authService.getCurrentUser();
        if (!user) return;

        const application: Application = {
            userId: user.id,
            offerId: String(job.id),
            title: job.title,
            company: job.company.display_name,
            location: job.location.display_name,
            url: job.redirect_url,
            status: 'en_attente',
            notes: '',
            dateAdded: new Date().toISOString(),
            description: job.description,
            contract_time: job.contract_time,
            contract_type: job.contract_type,
            salary_min: job.salary_min,
            salary_max: job.salary_max
        };

        this.applicationService.addApplication(application)
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

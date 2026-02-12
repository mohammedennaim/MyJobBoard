import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../shared/models/job.model';
import { JobCardComponent } from '../jobs/job-card/job-card.component';
import { AuthService } from '../../core/services/auth.service';
import { ModalService } from '../../core/services/modal.service';
import { PaginationService } from '../../core/services/pagination.service';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        CommonModule,
        JobCardComponent,
        ReactiveFormsModule
    ],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy {
    jobs: Job[] = [];
    loading = false;
    error = '';
    searchForm: FormGroup;

    currentPage = 1;
    itemsPerPage = 6;
    totalCount = 0;

    private destroy$ = new Subject<void>();

    constructor(
        private jobService: JobService,
        private fb: FormBuilder,
        private authService: AuthService,
        private modalService: ModalService,
        private paginationService: PaginationService
    ) {
        this.searchForm = this.fb.group({
            keyword: [''],
            location: ['']
        });
    }

    ngOnInit() {
        this.searchJobs();
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    onSearch() {
        this.currentPage = 1;
        this.searchJobs();
    }

    searchJobs() {
        this.loading = true;
        this.error = '';
        const { keyword, location } = this.searchForm.value;

        const searchLocation = location || 'paris';
        const searchKeyword = keyword || 'developer';

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
        console.log('Track application:', job);
    }
}

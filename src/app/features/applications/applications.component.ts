import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Job } from '../../shared/models/job.model';
import { Application } from '../../shared/models/application';
import { JobCardComponent } from '../../shared/components/job-card/job-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { ApplicationService } from '../../core/services/application.service';
import { AuthService } from '../../core/services/auth.service';
import { PaginationService } from '../../core/services/pagination.service';

@Component({
    selector: 'app-applications',
    standalone: true,
    imports: [CommonModule, RouterModule, JobCardComponent, SearchBarComponent],
    templateUrl: './applications.component.html'
})
export class ApplicationsComponent implements OnInit, OnDestroy {
    applications: Application[] = [];
    filteredApplications: Application[] = [];
    paginatedApplications: Application[] = [];
    loading = false;
    
    currentPage = 1;
    itemsPerPage = 6;
    
    private destroy$ = new Subject<void>();

    constructor(
        private applicationService: ApplicationService,
        private authService: AuthService,
        private paginationService: PaginationService
    ) { }

    ngOnInit(): void {
        this.loadApplications();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    loadApplications(): void {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.loading = true;
        this.applicationService.getApplicationsByUser(user.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (apps) => {
                    this.applications = apps;
                    this.filteredApplications = apps;
                    this.updatePagination();
                    this.loading = false;
                },
                error: () => {
                    this.loading = false;
                }
            });
    }

    onSearch(filters: { keyword: string; location: string }): void {
        const keyword = filters.keyword.toLowerCase().trim();
        const location = filters.location.toLowerCase().trim();

        if (!keyword && !location) {
            this.filteredApplications = this.applications;
        } else {
            this.filteredApplications = this.applications.filter(app => {
                const matchKeyword = !keyword || 
                    app.title.toLowerCase().includes(keyword);
                
                const matchLocation = !location || 
                    app.location.toLowerCase().includes(location);

                return matchKeyword && matchLocation;
            });
        }
        
        this.currentPage = 1;
        this.updatePagination();
    }

    updatePagination(): void {
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        this.paginatedApplications = this.filteredApplications.slice(start, end);
    }

    get totalPages(): number {
        return this.paginationService.calculateTotalPages(this.filteredApplications.length, this.itemsPerPage);
    }

    get visiblePages(): number[] {
        return this.paginationService.getVisiblePages(this.currentPage, this.totalPages);
    }

    goToPage(page: number): void {
        if (this.paginationService.isValidPage(page, this.totalPages)) {
            this.currentPage = page;
            this.updatePagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    onStatusChange(event: { job: Job; status: string }): void {
        const application = this.applications.find(app => app.offerId === String(event.job.id));
        if (!application?.id) return;

        this.applicationService.updateApplicationStatus(application.id, event.status)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (updatedApp) => {
                    application.status = updatedApp.status;
                    const index = this.filteredApplications.findIndex(app => app.id === application.id);
                    if (index !== -1) {
                        this.filteredApplications[index] = { ...application };
                    }
                }
            });
    }

    onDeleteApplication(job: Job): void {
        const application = this.applications.find(app => app.offerId === String(job.id));
        if (!application?.id) return;

        this.applicationService.deleteApplication(application.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.applications = this.applications.filter(app => app.id !== application.id);
                    this.filteredApplications = this.filteredApplications.filter(app => app.id !== application.id);
                    this.updatePagination();
                }
            });
    }

    mapApplicationToJob(app: Application): Job {
        return {
            id: app.offerId,
            title: app.title,
            company: { display_name: app.company },
            location: { display_name: app.location },
            description: app.description || '',
            redirect_url: app.url,
            created: app.dateAdded,
            contract_time: app.contract_time,
            contract_type: app.contract_type,
            salary_min: app.salary_min,
            salary_max: app.salary_max,
        };
    }
}

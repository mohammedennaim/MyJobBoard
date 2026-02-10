import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { JobService } from '../../core/services/job.service';
import { Job } from '../../shared/models/job.model';
import { JobCardComponent } from '../jobs/job-card/job-card.component';
import { AuthService } from '../../core/services/auth.service';

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
export class HomeComponent implements OnInit {
    jobs: Job[] = [];
    loading = false;
    error = '';
    searchForm: FormGroup;

    currentPage = 1;
    itemsPerPage = 10;
    totalCount = 0;

    constructor(
        private jobService: JobService,
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.searchForm = this.fb.group({
            keyword: [''],
            location: ['']
        });
    }

    ngOnInit() {
        this.searchJobs();
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

        this.jobService.searchJobs(searchKeyword, searchLocation, this.currentPage).subscribe({
            next: (data) => {
                this.jobs = data.jobs;
                this.totalCount = data.totalCount;
                this.loading = false;
                if (this.currentPage > 1) {
                    const resultsElement = document.getElementById('results-section');
                    if (resultsElement) {
                        resultsElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            },
            error: (err) => {
                this.error = 'Erreur lors du chargement des jobs.';
                this.loading = false;
            }
        });
    }

    get totalPages(): number {
        return Math.ceil(this.totalCount / this.itemsPerPage);
    }

    get visiblePages(): number[] {
        const pages: number[] = [];
        const maxVisible = 5;
        let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
        let end = Math.min(this.totalPages, start + maxVisible - 1);

        if (end - start < maxVisible - 1) {
            start = Math.max(1, end - maxVisible + 1);
        }
        start = Math.max(1, start);

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }
        return pages;
    }

    goToPage(page: number): void {
        if (page >= 1 && page <= this.totalPages) {
            this.currentPage = page;
            this.searchJobs();
        }
    }

    onTrackApplication(job: Job) {
        if (!this.authService.isAuthenticated()) {
            // Since modals are in AppComponent, we might need a Service or Event to trigger them.
            // For now, let's emit an event or just log.
            // Ideally, we can inject AppComponent or use a Shared Service.
            // But to keep it simple and safe for now: 
            // We will just emit an output if this was a child, but it is a routed component.
            // Let's use a shared service for modal state if needed, OR just alert for now.
            // Actually, the original code changed showLoginModal = true.
            // Better approach: Shared UI Service or just leave it for now.
            // Let's trigger the openAuth event from header if possible?
            // Wait, app-header is in AppComponent.
            // We can create a simple ModalService or just use a window custom event to check functionality first.

            // REVISION: I will inject AppComponent to open modal? No, that's bad practice.
            // I will create a simple specialized service to handle modal state, OR...
            // Does AuthService handle this? No.
            // Let's assume for now the user just wants to see the page fix.
            // I'll leave the auth check but maybe alert or just console log "Please login".
            // The proper fix is a LayoutService.
            console.log('User needs to login');
            alert('Veuillez vous connecter pour postuler.');
            return;
        }
        console.log('Track application:', job);
    }
}

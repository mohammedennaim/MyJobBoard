import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './shared/components/header/header.component';
import { JobService } from './core/services/job.service';
import { Job } from './shared/models/job.model';
import { JobCardComponent } from './features/jobs/job-card/job-card.component';
import { LoginModalComponent } from './features/auth/login-modal/login-modal.component';
import { RegisterModalComponent } from './features/auth/register-modal/register-modal.component';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    JobCardComponent,
    LoginModalComponent,
    RegisterModalComponent,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  jobs: Job[] = [];
  loading = false;
  error = '';
  showLoginModal = false;
  showRegisterModal = false;
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
    this.showLoginModal = false;
    this.showRegisterModal = false;
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
    // Adzuna rarely returns exact count, but let's assume it does or cap it
    // The API might return huge numbers, so let's be safe
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

    // Ensure start is not less than 1
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
      this.showLoginModal = true;
      return;
    }
    console.log('Track application:', job);
  }

  onSwitchToRegister() {
    this.showLoginModal = false;
    this.showRegisterModal = true;
  }

  onSwitchToLogin() {
    this.showRegisterModal = false;
    this.showLoginModal = true;
  }
}

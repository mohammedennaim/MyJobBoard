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
    this.searchJobs();
  }

  searchJobs() {
    this.loading = true;
    this.error = '';
    const { keyword, location } = this.searchForm.value;

    const searchLocation = location || 'paris';
    const searchKeyword = keyword || 'developer';

    this.jobService.searchJobs(searchKeyword, searchLocation).subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des jobs.';
        this.loading = false;
      }
    });
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

import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { JobService } from './core/services/job.service';
import { Job } from './shared/models/job.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, CommonModule],
  template: `
    <app-header></app-header>
    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Job Finder - Verification</h1>
      <div *ngIf="loading">Chargement des offres...</div>
      <div *ngIf="error">{{ error }}</div>
      
      <div class="grid gap-4" *ngIf="!loading && !error">
        <div *ngFor="let job of jobs" class="border p-4 rounded shadow">
          <h2 class="font-bold text-xl">{{ job.title }}</h2>
          <p class="text-gray-600">{{ job.company.display_name }} - {{ job.location.display_name }}</p>
          <p class="mt-2">{{ job.description | slice:0:150 }}...</p>
          <a [href]="job.redirect_url" target="_blank" class="text-blue-500 mt-2 inline-block">Voir l'offre</a>
        </div>
      </div>
      
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    main {
      flex: 1;
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'JobFinder';
  jobs: Job[] = [];
  loading = true;
  error = '';

  constructor(private jobService: JobService) { }

  ngOnInit() {
    this.jobService.searchJobs('developer', 'paris').subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
        console.log('Jobs fetched:', data);
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des jobs via Adzuna API';
        this.loading = false;
        console.error(err);
      }
    });
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { Summary } from '../../models/summary.model';
import { ChartPoint } from '../../models/chart.model';
import { Category } from '../../models/category.model';
import { DashboardService } from './dashboard.service';
import { DashboardComponent } from './dashboard.component';

@Component({
  selector: 'app-dashboard-container',
  standalone: true,
  imports: [CommonModule, DashboardComponent],
  template: `
    <app-dashboard
      [summary]="summary"
      [chartData]="chartData"
      [categories]="categories"
      [selectedCategoryId]="selectedCategoryId"
      [month]="month"
      [errorMessage]="errorMessage"
      (refresh)="reload()"
      (categoryChange)="onCategoryChange($event)">
    </app-dashboard>
  `
})
export class DashboardContainerComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  summary: Summary | null = null;
  chartData: ChartPoint[] = [];
  categories: Category[] = [];
  selectedCategoryId = '';
  month = new Date().toISOString().slice(0, 7);
  errorMessage = '';

  ngOnInit() {
    this.loadCategories();

    this.route.queryParamMap.subscribe(params => {
      this.selectedCategoryId = params.get('categoryId') ?? '';
      this.month = params.get('month') ?? new Date().toISOString().slice(0, 7);
      this.loadDashboardData();
    });
  }

  loadCategories() {
    this.dashboardService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadDashboardData() {
    this.errorMessage = '';

    forkJoin({
      summary: this.dashboardService.getSummary(this.month, this.selectedCategoryId),
      chart: this.dashboardService.getChart(this.month, this.selectedCategoryId)
    }).subscribe({
      next: ({ summary, chart }) => {
        this.summary = summary;
        this.chartData = chart;
      },
      error: () => {
        this.summary = null;
        this.chartData = [];
        this.errorMessage = 'Não foi possível carregar os dados do dashboard.';
      }
    });
  }

  reload() {
    this.loadDashboardData();
  }

  onCategoryChange(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        categoryId: categoryId || null,
        month: this.month
      },
      queryParamsHandling: 'merge'
    });
  }
}

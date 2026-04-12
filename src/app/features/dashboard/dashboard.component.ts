import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Summary } from '../../models/summary.model';
import { ChartPoint } from '../../models/chart.model';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);

  summary: Summary | null = null;
  chartData: ChartPoint[] = [];
  categories: Category[] = [];
  selectedCategoryId: string = '';

  readonly month = new Date().toISOString().slice(0, 7);

  get maxChartValue(): number {
    if (!this.chartData.length) return 1;
    return Math.max(...this.chartData.map(p => Math.abs(p.value)));
  }

  get currentDay(): number {
    return new Date().getDate();
  }

  barHeight(value: number): number {
    return Math.round((Math.abs(value) / this.maxChartValue) * 100);
  }

  ngOnInit() {
    this.loadCategories();
    this.loadSummary();
    this.loadChart();
  }

  loadCategories() {
    this.http.get<Category[]>('http://localhost:5000/api/categories').subscribe(data => {
      this.categories = data;
    });
  }

  loadSummary() {
    let url = `http://localhost:5000/api/transactions/summary?month=${this.month}`;
    if (this.selectedCategoryId) url += `&categoryId=${this.selectedCategoryId}`;
    this.http.get<Summary>(url).subscribe(data => {
      this.summary = data;
    });
  }

  loadChart() {
    let url = `http://localhost:5000/api/transactions/chart?month=${this.month}`;
    if (this.selectedCategoryId) url += `&categoryId=${this.selectedCategoryId}`;
    this.http.get<ChartPoint[]>(url).subscribe(data => {
      this.chartData = data;
    });
  }

  onCategoryChange() {
    this.loadSummary();
    this.loadChart();
  }
}
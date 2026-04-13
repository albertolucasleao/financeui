import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
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
export class DashboardComponent implements OnChanges {
  @Input() summary: Summary | null = null;
  @Input() chartData: ChartPoint[] = [];
  @Input() categories: Category[] = [];
  @Input() selectedCategoryId: string = '';
  @Input() month: string = new Date().toISOString().slice(0, 7);
  @Input() errorMessage: string = '';

  @Output() refresh = new EventEmitter<void>();
  @Output() categoryChange = new EventEmitter<string>();

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

  ngOnChanges(): void {
    // Inputs gerenciados pelo container — nenhuma lógica interna aqui
  }

  onRefresh(): void {
    this.refresh.emit();
  }

  onCategoryChange() {
    this.categoryChange.emit(this.selectedCategoryId);
  }
}
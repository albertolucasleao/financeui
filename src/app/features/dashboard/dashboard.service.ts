import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../../core/services/api.service';
import { Category } from '../../models/category.model';
import { ChartPoint } from '../../models/chart.model';
import { Summary } from '../../models/summary.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>('categories');
  }

  getSummary(month: string, categoryId?: string): Observable<Summary> {
    return this.api.get<Summary>('transactions/summary', {
      month,
      categoryId: categoryId || undefined
    });
  }

  getChart(month: string, categoryId?: string): Observable<ChartPoint[]> {
    return this.api.get<ChartPoint[]>('transactions/chart', {
      month,
      categoryId: categoryId || undefined
    });
  }
}
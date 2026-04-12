import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable } from 'rxjs';
import { Transaction } from '../../models/transaction.model';
import { PagedResult } from '../../models/paged-result.model';
import { Category } from '../../models/category.model';
import { CreateTransactionDto, UpdateTransactionDto, TransactionFilterParams } from '../../models/transaction-dto.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  constructor(private api: ApiService) { }

  getTransactions(params: TransactionFilterParams): Observable<PagedResult<Transaction>> {
    return this.api.get<PagedResult<Transaction>>('transactions', params as unknown as Record<string, string | number | boolean | undefined>);
  }

  createTransaction(data: CreateTransactionDto): Observable<Transaction> {
    return this.api.post<Transaction>('transactions', data);
  }

  updateTransaction(id: string, data: UpdateTransactionDto): Observable<Transaction> {
    return this.api.put<Transaction>(`transactions/${id}`, data);
  }

  deleteTransaction(id: string): Observable<void> {
    return this.api.delete<void>(`transactions/${id}`);
  }

  getCategories(): Observable<Category[]> {
    return this.api.get<Category[]>('categories');
  }
}
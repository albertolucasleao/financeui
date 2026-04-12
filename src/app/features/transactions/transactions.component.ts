import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { BehaviorSubject, switchMap, map, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TransactionsService } from './transactions.service';
import { Transaction } from '../../models/transaction.model';
import { PagedResult } from '../../models/paged-result.model';
import { Category } from '../../models/category.model';
import { TransactionFormComponent } from './components/transaction-form.component';
import { CreateTransactionDto, UpdateTransactionDto } from '../../models/transaction-dto.model';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatDialogModule
  ],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements OnInit {

  constructor(
    private service: TransactionsService,
    private dialog: MatDialog,
    private notification: NotificationService
  ) { }

  private destroyRef = inject(DestroyRef);

  categories: Category[] = [];
  selectedCategoryId: string = '';
  selectedMonth: string = '';

  readonly availableMonths = [
    { value: '', label: 'Todos os meses' },
    { value: '2026-04', label: 'Abril 2026' },
    { value: '2026-03', label: 'Março 2026' },
    { value: '2026-02', label: 'Fevereiro 2026' },
  ];

  ngOnInit() {
    this.service.getCategories().subscribe(cats => {
      this.categories = cats;
    });
  }

  getCategoryName(categoryId: string | null): string {
    if (!categoryId) return '—';
    return this.categories.find(c => c.id === categoryId)?.name ?? '—';
  }

  displayedColumns = ['description', 'category', 'amount', 'date', 'actions'];

  private stateSubject = new BehaviorSubject<{
    page: number;
    size: number;
    month?: string;
    categoryId?: string;
  }>({
    page: 1,
    size: 10,
    month: undefined,
    categoryId: undefined
  });

  totalItems = 0;



  transactions$ = this.stateSubject.pipe(
    switchMap(state =>
      this.service.getTransactions({
        page: state.page,
        limit: state.size,
        month: state.month,
        categoryId: state.categoryId
      })
    ),
    map((result: PagedResult<Transaction>) => {
      this.totalItems = result.total;
      return result.data;
    })
  );

  onPageChange(event: PageEvent) {
    const current = this.stateSubject.value;

    this.stateSubject.next({
      ...current,
      page: event.pageIndex + 1,
      size: event.pageSize
    });
  }

  onMonthChange(month: string) {
    this.selectedMonth = month;
    const current = this.stateSubject.value;
    this.stateSubject.next({ ...current, month: month || undefined, page: 1 });
  }

  onCategoryChange(categoryId: string) {
    this.selectedCategoryId = categoryId;
    const current = this.stateSubject.value;
    this.stateSubject.next({ ...current, categoryId: categoryId || undefined, page: 1 });
  }

  selectSidebarCategory(categoryId: string) {
    const next = this.selectedCategoryId === categoryId ? '' : categoryId;
    this.onCategoryChange(next);
  }

  openCreateDialog() {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (!result) return;

      const createDto: CreateTransactionDto = {
        ...result,
        userId: '105FA51B-F5CB-4D78-929E-1806AFDA5A82' // TODO: Obter do contexto de autenticação
      };

      this.service.createTransaction(createDto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.notification.success('Transação criada com sucesso');
        this.stateSubject.next({
          ...this.stateSubject.value
        });
      });
    });
  }

  edit(transaction: Transaction) {

    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '400px',
      data: transaction
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(result => {
      if (!result) return;

      const updateDto: UpdateTransactionDto = result;

      this.service.updateTransaction(transaction.id, updateDto)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.notification.success('Transação atualizada com sucesso');
          this.stateSubject.next({
            ...this.stateSubject.value
          });
        });
    });
  }

  delete(transaction: Transaction) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar exclusão',
        message: `Deseja excluir "${transaction.description}"?`
      }
    });

    dialogRef.afterClosed().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(confirm => {
      if (!confirm) return;

      this.service.deleteTransaction(transaction.id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {

          this.notification.success('Transação excluída com sucesso');

          this.stateSubject.next({
            ...this.stateSubject.value
          });
        });
    });
  }

}
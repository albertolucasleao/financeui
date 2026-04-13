import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { Transaction } from '../../../models/transaction.model';
import { Category } from '../../../models/category.model';
import { TransactionHistory, ChangeTypeLabel } from '../../../models/transaction-history.model';
import { CategoryBreakdown } from '../../../models/category-breakdown.model';
import { TransactionsService } from '../transactions.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-transaction-details',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule],
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<TransactionDetailsComponent>);
  private dialog = inject(MatDialog);
  private service = inject(TransactionsService);
  private notification = inject(NotificationService);

  data: { transaction: Transaction; categories: Category[] } = inject(MAT_DIALOG_DATA);

  history: TransactionHistory[] = [];
  breakdown: CategoryBreakdown[] = [];
  isLoading = true;
  errorMessage = '';

  readonly changeTypeLabel = ChangeTypeLabel;

  get transaction(): Transaction {
    return this.data.transaction;
  }

  get categories(): Category[] {
    return this.data.categories;
  }

  getCategoryName(categoryId: string | null): string {
    if (!categoryId) return '—';
    return this.categories.find(c => c.id === categoryId)?.name ?? '—';
  }

  get month(): string {
    return this.transaction.date.substring(0, 7);
  }

  get maxBreakdownTotal(): number {
    if (!this.breakdown.length) return 1;
    return Math.max(...this.breakdown.map(b => b.total));
  }

  barWidth(total: number): number {
    return Math.round((total / this.maxBreakdownTotal) * 100);
  }

  ngOnInit(): void {
    forkJoin({
      history: this.service.getTransactionHistory(this.transaction.id),
      breakdown: this.service.getCategoryBreakdown(this.month)
    }).subscribe({
      next: ({ history, breakdown }) => {
        this.history = history;
        this.breakdown = breakdown;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os detalhes.';
        this.isLoading = false;
      }
    });
  }

  confirmDelete(): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirmar exclusão',
        message: `Deseja excluir "${this.transaction.description}"?`
      }
    });

    ref.afterClosed().subscribe(confirmed => {
      if (!confirmed) return;
      this.service.deleteTransaction(this.transaction.id).subscribe({
        next: () => {
          this.notification.success('Transação excluída com sucesso');
          this.dialogRef.close({ action: 'deleted' });
        },
        error: () => {
          this.notification.error('Erro ao excluir a transação');
        }
      });
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}

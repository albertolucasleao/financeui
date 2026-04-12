// DTOs para operações de transação
export interface CreateTransactionDto {
  description: string;
  amount: number;
  type: number;
  categoryId: string;
  date: string;
  userId: string;
}

export interface UpdateTransactionDto {
  description: string;
  amount: number;
  type: number;
  categoryId: string;
  date: string;
}

// Parâmetros para filtros de transação
export interface TransactionFilterParams {
  page: number;
  limit: number;
  month?: string;
  categoryId?: string;
}
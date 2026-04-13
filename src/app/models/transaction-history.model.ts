export interface TransactionHistory {
  id: string;
  transactionId: string;
  changedBy: string;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changeType: number;
  changedAt: string;
}

export const ChangeTypeLabel: Record<number, string> = {
  0: 'Criada',
  1: 'Atualizada',
  2: 'Excluída'
};

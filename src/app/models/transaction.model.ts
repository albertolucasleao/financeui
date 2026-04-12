export interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: number;
    categoryId: string | null;
    date: string;
    status?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
}

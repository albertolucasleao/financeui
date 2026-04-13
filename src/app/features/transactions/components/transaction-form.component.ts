import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { TransactionsService } from '../transactions.service';

@Component({
    selector: 'app-transaction-form',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule
    ],
    templateUrl: './transaction-form.component.html',
    styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {

    private fb = inject(FormBuilder);
    private service = inject(TransactionsService);

    private dialogRef = inject(MatDialogRef<TransactionFormComponent>, { optional: true });
    public data = inject(MAT_DIALOG_DATA, { optional: true });

    get modalTitle(): string {
        return this.data ? 'Editar Transação' : 'Nova Transação';
    }

    form = this.fb.group({
        description: ['', Validators.required],
        amount: [0, [Validators.required, Validators.min(1)]],
        type: [1, Validators.required],
        categoryId: ['', Validators.required],
        date: ['', Validators.required],
        notes: ['', [Validators.maxLength(1000)]]
    });

    ngOnInit(): void {
        if (this.data) {
            this.populateForm();
        }
    }

    private populateForm() {
        this.form.patchValue({
            description: this.data.description,
            amount: this.data.amount,
            type: this.data.type,
            categoryId: this.data.categoryId,
            date: this.data.date?.substring(0, 10),
            notes: this.data.notes ?? ''
        });
    }

    categories$ = this.service.getCategories();

    save() {
        if (this.form.invalid) return;

        this.dialogRef?.close(this.form.value);
    }

    close() {
        this.dialogRef?.close();
    }
}
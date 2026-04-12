import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <h2>{{ data.title }}</h2>

    <p>{{ data.message }}</p>

    <div style="display: flex; justify-content: flex-end; gap: 10px;">
      <button mat-button (click)="close()">Cancelar</button>
      <button mat-raised-button color="warn" (click)="confirm()">Excluir</button>
    </div>
  `
})
export class ConfirmDialogComponent {

  private dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  confirm() {
    this.dialogRef.close(true);
  }

  close() {
    this.dialogRef.close(false);
  }
}
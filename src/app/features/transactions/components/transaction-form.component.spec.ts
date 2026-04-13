import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { TransactionFormComponent } from './transaction-form.component';
import { TransactionsService } from '../transactions.service';

describe('TransactionFormComponent', () => {
  let component: TransactionFormComponent;
  let fixture: ComponentFixture<TransactionFormComponent>;

  const serviceMock = {
    getCategories: jasmine.createSpy('getCategories').and.returnValue(
      of([{ id: 'cat-1', name: 'Categoria Teste' }])
    )
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionFormComponent],
      providers: [
        { provide: TransactionsService, useValue: serviceMock },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            description: 'Transacao',
            amount: 100,
            type: 1,
            categoryId: 'cat-1',
            date: '2026-04-10T00:00:00',
            notes: 'Nota inicial'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize notes from dialog data', () => {
    expect(component.form.get('notes')?.value).toBe('Nota inicial');
  });

  it('should keep notes control in form', () => {
    component.form.patchValue({ notes: 'Nova nota' });
    expect(component.form.get('notes')?.value).toBe('Nova nota');
  });
});

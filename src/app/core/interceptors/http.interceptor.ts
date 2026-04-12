import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse
} from '@angular/common/http';
import { finalize, catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadingService } from '../services/loading.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {

  const loading = inject(LoadingService);
  const snackBar = inject(MatSnackBar);

  loading.show();

  return next(req).pipe(
    finalize(() => loading.hide()),
    catchError((error: HttpErrorResponse) => {
      let message = 'Erro ao processar requisição';

      if (error.status === 400) {
        message = 'Dados inválidos: ' + (error.error?.message || '');
      } else if (error.status === 401) {
        message = 'Sessão expirada. Faça login novamente';
      } else if (error.status === 403) {
        message = 'Você não tem permissão para esta ação';
      } else if (error.status >= 500) {
        message = 'Erro no servidor. Tente novamente mais tarde';
      }

      snackBar.open(message, 'Fechar', {
        duration: 3000
      });

      return throwError(() => error);
    })
  );
};
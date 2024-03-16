import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorComponent } from './error/error.component';
import { MatDialog } from '@angular/material/dialog';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private dialog: MatDialog) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.dialog.open(ErrorComponent, {
          data: {
            message: error.error ? error.error.message : "Une erreur inconnu est arrivé",
            login: error.url?.endsWith('Login')
          }
        });
        return throwError(error);
      })
    );
  };
}

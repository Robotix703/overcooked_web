import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const apiKey = this.authService.getApiKey();

    const authRequest = req.clone({
      headers: req.headers.set('x-api-key', apiKey)
    });
    return next.handle(authRequest);
  };
}

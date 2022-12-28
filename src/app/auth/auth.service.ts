import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { AuthData } from "./auth-data.model";
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

const URL_BACKEND = environment.apiURL + "user";
@Injectable({ providedIn: "root" })

export class AuthService {

  private token = "";

  private authStatus = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: NodeJS.Timeout = setTimeout(() => {}, 9999);
  private userId = "";

  constructor(private http: HttpClient, private router: Router) { }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatus.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  createUser(email: string, password: string, inviteCode: string, phoneNumber: string) {
    const authData = { email: email, password: password, invitationCode: inviteCode, phoneNumber: phoneNumber };

    this.http.post(URL_BACKEND + "/signup", authData)
      .subscribe(reponse => {
        this.router.navigate(['/']);
      }, error => {
        this.authStatus.next(false);
      });
  }

  getUserId() {
    return this.userId;
  }

  login(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };

    this.http.post<{ token: string, expiresIn: number, userId: string }>(URL_BACKEND + "/login", authData)
      .subscribe(reponse => {
        const token = reponse.token;
        this.token = token;

        if (token) {
          this.authStatus.next(true);
          this.isAuthenticated = true;

          this.userId = reponse.userId;

          const expiresDuration = reponse.expiresIn;
          this.setAuthTimer(expiresDuration);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);

          this.router.navigate(['/']);
        }
      }, error => {
        this.authStatus.next(false);
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.userId = authInformation.userId;
      this.authStatus.next(true);
    }
  }

  logout() {
    this.token = "";
    this.isAuthenticated = false;
    this.authStatus.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = "";

    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem("token") || "";
    const expirationDate = localStorage.getItem("expiration") || "";
    const userId = localStorage.getItem('userId') || "";

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}

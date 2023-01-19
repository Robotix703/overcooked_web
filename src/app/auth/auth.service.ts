import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

const URL_BACKEND = environment.apiURL;
@Injectable({ providedIn: "root" })

export class AuthService {

  private apiKey = "";
  private authStatus = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(private http: HttpClient, private router: Router) { }

  getApiKey() {
    return this.apiKey;
  }

  getAuthStatusListener() {
    return this.authStatus.asObservable();
  }
  getIsAuth() {
    return this.isAuthenticated;
  }

  login(apiKey: string) {
    this.http.post<boolean>(URL_BACKEND + "login", { apiKey: apiKey })
      .subscribe(reponse => {
        if (reponse) {
          this.authStatus.next(true);
          this.isAuthenticated = true;

          this.saveAuthData(apiKey);
          this.router.navigate(['/']);
        }
      });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    this.apiKey = authInformation.apiKey;
    this.isAuthenticated = true;
    this.authStatus.next(true);
  }

  logout() {
    this.apiKey = "";
    this.isAuthenticated = false;
    this.authStatus.next(false);
    this.clearAuthData();

    this.router.navigate(['/']);
  }

  private saveAuthData(apiKey: string) {
    localStorage.setItem('apiKey', apiKey);
  }

  private clearAuthData() {
    localStorage.removeItem('apiKey');
  }

  private getAuthData() {
    const apiKey = localStorage.getItem("apiKey") || "";

    if (!apiKey) return;

    return {
      apiKey: apiKey
    }
  }
}

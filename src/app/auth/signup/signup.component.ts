import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'signup',
  templateUrl: './signup.component.html',
  styleUrls: ["./signup.component.css"]
})

export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;

  private authStatusSub: Subscription = new Subscription();

  constructor(public authService: AuthService) { };

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.authService.createUser(form.value.email, form.value.password, form.value.inviteCode, form.value.phoneNumber);
  }
}

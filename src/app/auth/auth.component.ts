import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthResponseData, AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  constructor (private authService: AuthService, private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode; // toggle
  }

  onSubmit(form: NgForm) {
    console.log(form.value);
    // Safety check before trying a Request
    if (!form.valid) { return; }

    this.isLoading = true;
    let authObs: Observable<AuthResponseData>;

    // Logging In
    if (this.isLoginMode) {
      authObs = this.authService.login(form.value.email, form.value.password);
    }
    // Signing Up
    else {
      authObs = this.authService.signup(form.value.email, form.value.password);
    }

    // Subscribe to process either Request
    authObs.subscribe(
      responseData => {
        console.log(responseData);
        this.isLoading = false;
        // upon success, navigate the user to their Recipes page
        this.router.navigate(['/recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }
}

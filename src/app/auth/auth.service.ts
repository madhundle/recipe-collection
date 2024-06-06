import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "./user.model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";

export interface AuthResponseData {
  /*
  HTTP Responses from the Firebase Auth API have these properties
  */
  kind: string, // No longer listed in API Documentation, but comes back in Responses
  idToken: string, // A Firebase Auth ID token for the newly created user.
  email: string, // The email for the newly created user.
  refreshToken: string, // A Firebase Auth refresh token for the newly created user.
  expiresIn: string, // The number of seconds in which the ID token expires.
  localId: string // The uid of the newly created user.
  // Part of Sign In Responses only, not Sign Up:
  registered?: boolean // Whether the email is for an existing account.
}

@Injectable({providedIn: 'root'})
export class AuthService {
  /*
  Sign up new users, log in users, and handle errors on those requests
  */
  private tokenExpiryTimer: any; // track user's token expiration
  user = new BehaviorSubject<User>(null); // must be initialized

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    /*
    Send an HTTP Request to sign up a new user
    */
    return this.http.post<AuthResponseData>( // best practice to <AuthResponseData>
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='+environment.firebaseApiKey,
      {
        'email': email,
        'password': password,
        'returnSecureToken': true
      }
    ).pipe(
      catchError(this.handleError),
      tap(respData => {
        this.handleAuth(respData.email, 
                        respData.localId, 
                        respData.idToken, 
                        +respData.expiresIn);
      }));
  }

  login(email: string, password: string) {
    /*
    Send an HTTP Request to log in a user
    */
    return this.http.post<AuthResponseData>( // best practice to <AuthResponseData>
      'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key='+environment.firebaseApiKey,
      {
        'email': email,
        'password': password,
        'returnSecureToken': true
      }
    ).pipe(
      catchError(this.handleError),
      tap(respData => {
        this.handleAuth(respData.email, 
                      respData.localId, 
                      respData.idToken, 
                      +respData.expiresIn);
    }));

  }

  logout() {
    // set our user to null
    this.user.next(null);
    // clear the user from LocalStorage
    localStorage.removeItem('userData');
    // navigate to Authentication page so a user could log back in
    this.router.navigate(['/auth']);
    // if we are tracking token expiration, clear that
    if (this.tokenExpiryTimer) {
      clearTimeout(this.tokenExpiryTimer);
    }
    this.tokenExpiryTimer = null;
  }

  autoLogin() {
    /*
    If the browser already knows this user and they're valid, authenticate
    */
    const userData: {email: string, 
                     id: string, 
                     _token: string, 
                     _tokenExpiryDate: string 
                    } = JSON.parse(localStorage.getItem('userData'));
    
    // If there's no stored user, just return
    if (!userData) { return; }

    // If there's a stored user, extract their info
    const loadedUser = new User(userData.email, 
                                userData.id, 
                                userData._token, 
                                new Date(userData._tokenExpiryDate)
                              );

    // If the user's token is valid, make all necessary updates based on
    // successful authentication
    if (loadedUser.token) {
      // Emit this with the Subject as our new user
      this.user.next(loadedUser);
      // Start an expiration timer on their token
      // Duration is calculated as their expiry time - current time
      const expiryDuration = new Date(userData._tokenExpiryDate).getTime() - new Date().getTime();
      this.autoLogout(expiryDuration);
    }
  }

  autoLogout(expiryDuration: number) {
    /*
    Start a timer for auto-logout on token expiration, in milliseconds
    */
    this.tokenExpiryTimer = setTimeout(() => {
      this.logout();
    }, expiryDuration);
  }

  private handleAuth(email: string, userId: string, token: string, expiresIn: number) {
    /*
    Make all necessary updates when a user has successfully authenticated
    */
    const expiryDate = new Date(new Date().getTime() + expiresIn*1000);
    const user = new User(email, userId, token, expiryDate);
    // Emit this with the Subject as our new user
    this.user.next(user);
    // Start an expiration timer on their token
    this.autoLogout(expiresIn*1000);
    // Save it to LocalStorage so it persists
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorResponse: HttpErrorResponse) {
    /*
    Process an Error Response from an HTTP Request
    */
    console.log(errorResponse);
    let errorMsg: string = 'An unknown error occurred. Please try again later.';

    // Check for the fields required below before proceeding
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(() => new Error(errorMsg));
    }

    // Respond accordingly per error message
    switch (errorResponse.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMsg = 'An account already exists for this email address.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMsg = 'Invalid login credentials. Please try again.';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMsg = 'No account found associated with this email address.';
        break;
      case 'INVALID_PASSWORD':
        errorMsg = 'Incorrect password. Please try again.';
        break;
      }
    return throwError(() => new Error(errorMsg));
  }


}
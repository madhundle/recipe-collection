import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { exhaustMap, take } from "rxjs";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  /*
  Interceptor to add authorization token to all applicable Requests
  */
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      // take(1) will get us 1 user and automatically unsubscribe
      //   we don't need to maintain an open, active subscription
      //   we just need the current user and that's it
      take(1), 
      // exhaustMap lets us "chain" observables so we can both
      //   get the info from the authService, then create our HTTP request
      //   based on that info, and return the Observable for that Request
      exhaustMap(user => {
        // if we don't have a user, just pass the request as-is
        if (!user) {
          return next.handle(req);
        }
        // add the user's token to the request
        const modReq = req.clone({
          params: new HttpParams().set('auth', user.token)});
        return next.handle(modReq);
      })
    );
  }
}
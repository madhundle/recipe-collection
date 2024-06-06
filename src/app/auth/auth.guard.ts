import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable, map, take } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  /*
  Authentication Guard which checks for an authenticated user 
  or redirects to the Authentication page
  */
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
    boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    
    return this.authService.user.pipe(
      take(1), // don't keep an active sub, just check once
      map(user => {
      // If there is an authenticated user, return true, they're allowed access
      const isAuth = !!user; // boolean trick to reflect if a user exists
      if (isAuth) {
        return true;
      }

      // If there is not an authenticated user, redirect them when they attempt access
      return this.router.createUrlTree(['/auth']);
    }));
  }
}
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean | UrlTree {
    if (!this.auth.isAuthenticated()) {
      // Return a UrlTree instead of navigating imperatively to support SSR/prerender
      return this.router.createUrlTree(['/login']);
    }
    return true;
  }
}

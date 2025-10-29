import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

// Minimal user shape expected from backend. Extend as needed.
export interface AuthUser {
  id?: number;
  name?: string;
  email?: string;
  // other fields from backend
}

export interface LoginResponse {
  token: string;
  user?: AuthUser;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Laravel backend base URL
  private apiUrl = 'http://127.0.0.1:8000/api'; // Laravel API
  private readonly USER_KEY = 'user';
  private readonly TOKEN_KEY = 'token';
  private readonly platformId = inject(PLATFORM_ID);

  private _userSubject = new BehaviorSubject<AuthUser | null>(this._loadUser());
  public user$: Observable<AuthUser | null> = this._userSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        // Persist token and user, and update observable
        if (response?.token) {
          localStorage.setItem(this.TOKEN_KEY, response.token);
        }
        if (response?.user) {
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          this._userSubject.next(response.user || null);
        } else {
          // If no user object provided, still notify observers with null
          this._userSubject.next(null);
        }
      })
    );
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    }
    this._userSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser()) return false;
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): AuthUser | null {
    return this._userSubject.value || this._loadUser();
  }

  private _loadUser(): AuthUser | null {
    try {
      if (!this.isBrowser()) return null;
      const raw = localStorage.getItem(this.USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}

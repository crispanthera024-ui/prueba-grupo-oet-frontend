import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('prueba-frontend');
  private storageHandler = (e: StorageEvent) => this.onStorage(e);
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('storage', this.storageHandler);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('storage', this.storageHandler);
    }
  }

  private onStorage(e: StorageEvent) {
    if (!e) return;
    // When token is removed in another tab, reflect logout locally
    if (e.key === 'token' || e.key === 'user') {
      const token = localStorage.getItem('token');
      if (!token) {
        this.auth.logout();
        try { this.router.navigate(['/login']); } catch {}
      } else {
        // Token added/changed (login in another tab), sync user data
        this.auth.syncFromStorage();
      }
    }
  }
}

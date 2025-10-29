import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<Theme>('light');

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  init() {
    if (!isPlatformBrowser(this.platformId)) return;
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored === 'dark' || stored === 'light') {
      this.apply(stored);
      return;
    }
    // Fallback to prefers-color-scheme
    try {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.apply(prefersDark ? 'dark' : 'light');
    } catch {
      this.apply('light');
    }
  }

  toggle() {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.apply(next);
  }

  set(theme: Theme) {
    this.apply(theme);
  }

  private apply(t: Theme) {
    this.theme.set(t);
    if (!isPlatformBrowser(this.platformId)) return;
    localStorage.setItem('theme', t);
    const root = document.documentElement;
    root.setAttribute('data-theme', t);
  }
}

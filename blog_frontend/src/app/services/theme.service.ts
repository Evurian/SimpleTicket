import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false);
  isDarkMode$ = this.isDarkMode.asObservable();

  constructor() {
    this.loadTheme();
  }

  toggleTheme(): void {
    const newMode = !this.isDarkMode.value;
    this.isDarkMode.next(newMode);
    this.applyTheme(newMode);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
    }
  }

  private loadTheme(): void {
    if (typeof localStorage !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      const isDark = storedTheme === 'dark' || (!storedTheme && prefersDark);
      this.isDarkMode.next(isDark);
      this.applyTheme(isDark);
    }
  }

  private applyTheme(isDark: boolean): void {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }
}

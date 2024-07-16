import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(this.checkLoggedIn());

  // Observable for login status
  loggedInStatus = this.loggedIn.asObservable();

  constructor() { }

  // Simulate login
  login(token: string) {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
    }
    this.loggedIn.next(true);
  }

  // Simulate logout
  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
    }
    this.loggedIn.next(false);
  }

  // Check login status
  isLoggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem('token');
  }

  // Check if running in browser
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  // Check login status on initialization
  private checkLoggedIn(): boolean {
    return this.isBrowser() && !!localStorage.getItem('token');
  }
}

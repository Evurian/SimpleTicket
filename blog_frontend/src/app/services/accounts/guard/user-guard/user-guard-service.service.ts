// src/app/services/accounts/guard/user-guard/user-guard.service.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../../session/session-service.service';

@Injectable({
  providedIn: 'root'
})
export class UserGuardService implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (this.sessionService.isConnected()) {
      return true;
    }
    this.router.navigate(['/sign-in']);
    return false;
  }
}

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from '../../session/session-service.service';
import { ProfileService } from '../../profile.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(
    private sessionService: SessionService,
    private profileService: ProfileService,
    private router: Router
  ) { }

  canActivate(): Observable<boolean> | boolean {
    if (!this.sessionService.isConnected()) {
      this.router.navigate(['/sign-in']);
      return false;
    }
    
    return this.profileService.getProfile().pipe(
      map(profile => {
        if (profile.is_staff || profile.is_superuser) {
          return true;
        }
        this.router.navigate(['/home']);
        return false;
      }),
      catchError(() => {
        this.router.navigate(['/sign-in']);
        return of(false);
      })
    );
  }
}

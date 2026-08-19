import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class SignInService {

  private apiUrl = `${environment.apiUrl}account`;

  constructor(private http: HttpClient) { }

  signIn(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signIn/`, credentials);
  }

  googleSignIn(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/google/`, { token });
  }

}
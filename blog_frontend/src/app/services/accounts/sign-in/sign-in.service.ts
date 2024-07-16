import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../guard/user-guard/user-guard-service.service';

interface SignInResponse {
  token: string;
}
@Injectable({
  providedIn: 'root'
})

export class SignInService {

  private apiUrl = 'http://localhost:8000/api/account';

  constructor(private http: HttpClient, private authService: AuthService) { }

  signIn(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/signIn/`, credentials);
  }
  handleSignIn(response: SignInResponse) {
    this.authService.login(response.token);
  }
}
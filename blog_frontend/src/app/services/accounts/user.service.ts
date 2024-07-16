import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    return this.http.get<any>(this.userUrl);
  }

  updateUser(user: any): Observable<any> {
    return this.http.put<any>(this.userUrl, user);
  }
}

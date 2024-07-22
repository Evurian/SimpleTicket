import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(): Observable<any> {
    return this.http.get('/api/user');
  }

  updateUser(user: any): Observable<any> {
    return this.http.put('/api/user', user);
  }

  getUserPurchases(): Observable<any[]> {
    return this.http.get<any[]>('/api/user/purchases');
  }
}

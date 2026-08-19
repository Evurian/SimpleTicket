import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = `${environment.apiUrl}account/profile/`;

  constructor(private http: HttpClient) { }

  private getToken(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  getProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }

  updateProfile(profileData: any): Observable<any> {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    const headers = new HttpHeaders({
      'Authorization': `Token ${token}`
    });

    return this.http.put<any>(`${this.apiUrl}update/`, profileData, { headers });
  }
}

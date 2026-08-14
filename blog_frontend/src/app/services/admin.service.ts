import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseAccountsUrl = 'http://localhost:8000/api/account/admin/users/';
  private baseProductsUrl = 'http://localhost:8000/api/products/';
  private baseOrdersUrl = 'http://localhost:8000/api/orders/admin/';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        return new HttpHeaders({
          'Authorization': `Token ${token}`
        });
      }
    }
    return new HttpHeaders();
  }

  // Dashboard Stats
  getDashboardStats(): Observable<any> {
    return this.http.get<any>(`${this.baseOrdersUrl}dashboard/`, { headers: this.getHeaders() });
  }

  // Orders Management
  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseOrdersUrl}orders/`, { headers: this.getHeaders() });
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put<any>(`${this.baseOrdersUrl}orders/${orderId}/`, { status }, { headers: this.getHeaders() });
  }

  // Product CRUD
  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.baseProductsUrl);
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseProductsUrl}categories/`);
  }

  createProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(this.baseProductsUrl, productData, { headers: this.getHeaders() });
  }

  updateProduct(productId: number, productData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseProductsUrl}${productId}/`, productData, { headers: this.getHeaders() });
  }

  deleteProduct(productId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseProductsUrl}${productId}/`, { headers: this.getHeaders() });
  }

  // Category creation
  createCategory(categoryData: any): Observable<any> {
    return this.http.post<any>(`${this.baseProductsUrl}categories/`, categoryData, { headers: this.getHeaders() });
  }

  // User Management
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.baseAccountsUrl, { headers: this.getHeaders() });
  }

  updateUser(userId: number, userData: any): Observable<any> {
    return this.http.put<any>(`${this.baseAccountsUrl}${userId}/`, userData, { headers: this.getHeaders() });
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseAccountsUrl}${userId}/`, { headers: this.getHeaders() });
  }
}

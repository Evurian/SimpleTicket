import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

export interface Productos {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ListaService {

  private apiUrl = `${environment.apiUrl}products/`;

  constructor(private http: HttpClient) { }
  
  getProducts(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.apiUrl);
  }
  getProductById(id: number): Observable<Productos> {
    return this.http.get<Productos>(`${this.apiUrl}${id}/`);
  }
  
}

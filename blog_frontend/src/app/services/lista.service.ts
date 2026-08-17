import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

  private apiUrl = 'http://localhost:8000/api/products/';

  constructor(private http: HttpClient) { }
  
  getProducts(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.apiUrl);
  }
  getProductById(id: number): Observable<Productos> {
    return this.http.get<Productos>(`${this.apiUrl}${id}/`);
  }
  
}

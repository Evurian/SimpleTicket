import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Productos } from './lista.service';
import { environment } from '../../environments/environment';

export interface CartItem {
  product: Productos;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItems.asObservable();

  private apiUrl = `${environment.apiUrl}orders/`;

  constructor(private http: HttpClient) {
    this.loadCart();
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Token ${token}`);
      }
    }
    return headers;
  }

  private saveCart(items: CartItem[]): void {
    this.cartItems.next(items);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }

  private loadCart(): void {
    if (typeof localStorage !== 'undefined') {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        try {
          this.cartItems.next(JSON.parse(storedCart));
        } catch (e) {
          console.error('Error parsing cart from localStorage', e);
        }
      }
    }
  }

  addToCart(product: Productos, quantity: number = 1): void {
    const currentItems = [...this.cartItems.value];
    const existingIndex = currentItems.findIndex(item => item.product.id === product.id);

    if (existingIndex > -1) {
      currentItems[existingIndex].quantity += quantity;
    } else {
      currentItems.push({ product, quantity });
    }

    this.saveCart(currentItems);
  }

  updateQuantity(productId: number, quantity: number): void {
    let currentItems = [...this.cartItems.value];
    const existingIndex = currentItems.findIndex(item => item.product.id === productId);

    if (existingIndex > -1) {
      if (quantity <= 0) {
        currentItems.splice(existingIndex, 1);
      } else {
        currentItems[existingIndex].quantity = quantity;
      }
      this.saveCart(currentItems);
    }
  }

  removeFromCart(productId: number): void {
    const currentItems = this.cartItems.value.filter(item => item.product.id !== productId);
    this.saveCart(currentItems);
  }

  clearCart(): void {
    this.saveCart([]);
  }

  getCartCount(): number {
    return this.cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
  }

  getCartTotal(): number {
    return this.cartItems.value.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  }

  getCartItems(): CartItem[] {
    return this.cartItems.value;
  }

  checkout(shippingAddress: string): Observable<any> {
    const items = this.cartItems.value.map(item => ({
      product_id: item.product.id,
      quantity: item.quantity
    }));

    const body = {
      items,
      shipping_address: shippingAddress
    };

    return this.http.post<any>(this.apiUrl, body, { headers: this.getHeaders() });
  }

  getOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }
}

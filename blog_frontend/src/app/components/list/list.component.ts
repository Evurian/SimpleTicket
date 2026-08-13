import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ListaService, Productos } from '../../services/lista.service';
import { CartService, CartItem } from '../../services/cart.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.sass'
})
export class ListComponent implements OnInit, OnDestroy {
  productos: Productos[] = [];
  filteredProductos: Productos[] = [];
  searchText: string = '';
  loading: boolean = true;

  // Cart properties
  cartItems: CartItem[] = [];
  cartTotal: number = 0;
  showCart: boolean = false;

  // Checkout properties
  showCheckout: boolean = false;
  checkoutStep: number = 1;
  shippingAddress: string = '';
  isSubmitting: boolean = false;
  orderSuccess: boolean = false;
  createdOrderId: number | null = null;
  checkoutError: string = '';

  private subs = new Subscription();

  constructor(
    private listService: ListaService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getData();

    // Subscribe to cart changes
    this.subs.add(
      this.cartService.cartItems$.subscribe(items => {
        this.cartItems = items;
        this.cartTotal = this.cartService.getCartTotal();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  getData(): void {
    this.loading = true;
    this.listService.getProducts().subscribe({
      next: (data) => {
        // Add an artificial short delay for a premium skeleton loader experience
        setTimeout(() => {
          this.productos = data;
          this.filteredProductos = data;
          this.loading = false;
        }, 600);
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
        this.loading = false;
      }
    });
  }

  onSearchTextChange(): void {
    this.filteredProductos = this.productos.filter(producto =>
      producto.title.toLowerCase().includes(this.searchText.toLowerCase()) ||
      producto.description.toLowerCase().includes(this.searchText.toLowerCase()) ||
      producto.category.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  viewProductDetails(productId: number): void {
    this.router.navigate(['/product', productId]);
  }

  addToCart(product: Productos, event: Event): void {
    event.stopPropagation(); // Avoid navigating to details
    this.cartService.addToCart(product, 1);
    this.showCart = true; // Slide open the cart to show feedback!
  }

  removeFromCart(productId: number, event: Event): void {
    event.stopPropagation();
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number, event: Event): void {
    event.stopPropagation();
    this.cartService.updateQuantity(productId, quantity);
  }

  toggleCart(): void {
    this.showCart = !this.showCart;
  }

  openCheckout(): void {
    if (this.cartItems.length === 0) return;
    this.showCart = false;
    this.showCheckout = true;
    this.checkoutStep = 1;
    this.orderSuccess = false;
    this.checkoutError = '';
  }

  closeCheckout(): void {
    this.showCheckout = false;
  }

  nextStep(): void {
    if (this.checkoutStep === 1) {
      this.checkoutStep = 2;
    }
  }

  prevStep(): void {
    if (this.checkoutStep === 2) {
      this.checkoutStep = 1;
    }
  }

  submitOrder(): void {
    if (!this.shippingAddress.trim()) {
      this.checkoutError = 'Por favor, introduce una dirección de envío válida.';
      return;
    }

    this.isSubmitting = true;
    this.checkoutError = '';

    this.cartService.checkout(this.shippingAddress).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.orderSuccess = true;
        this.createdOrderId = res.id;
        this.cartService.clearCart();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.checkoutError = err.error?.error || 'Error al procesar el pedido. Comprueba tu conexión.';
      }
    });
  }

  trackById(index: number, product: Productos): number {
    return product.id;
  }
}
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

  // Mock Payment properties
  cardNumber: string = '';
  cardName: string = '';
  cardExpiry: string = '';
  cardCvv: string = '';
  isProcessingPayment: boolean = false;
  paymentStatusMessage: string = '';

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
    // Reset payment fields
    this.cardNumber = '';
    this.cardName = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.isProcessingPayment = false;
    this.paymentStatusMessage = '';
  }

  closeCheckout(): void {
    this.showCheckout = false;
  }

  nextStep(): void {
    if (this.checkoutStep === 1) {
      this.checkoutStep = 2;
    } else if (this.checkoutStep === 2) {
      if (!this.shippingAddress.trim()) {
        this.checkoutError = 'Por favor, introduce una dirección de envío válida.';
        return;
      }
      this.checkoutError = '';
      this.checkoutStep = 3;
    }
  }

  prevStep(): void {
    if (this.checkoutStep === 2) {
      this.checkoutStep = 1;
    } else if (this.checkoutStep === 3) {
      this.checkoutStep = 2;
    }
  }

  // Formatting helpers for mock card UI
  formatCardNumber(event: any): void {
    let input = event.target.value.replace(/\D/g, '');
    input = input.substring(0, 16);
    const cardFormatted = input.match(/.{1,4}/g);
    this.cardNumber = cardFormatted ? cardFormatted.join(' ') : '';
  }

  formatExpiry(event: any): void {
    let input = event.target.value.replace(/\D/g, '');
    input = input.substring(0, 4);
    if (input.length > 2) {
      this.cardExpiry = input.substring(0, 2) + '/' + input.substring(2);
    } else {
      this.cardExpiry = input;
    }
  }

  formatCvv(event: any): void {
    const input = event.target.value.replace(/\D/g, '');
    this.cardCvv = input.substring(0, 4);
  }

  payAndSubmit(): void {
    // Basic validations
    if (!this.cardName.trim()) {
      this.checkoutError = 'Por favor, introduce el nombre del titular.';
      return;
    }
    const cleanNum = this.cardNumber.replace(/\s+/g, '');
    if (cleanNum.length < 15) {
      this.checkoutError = 'El número de tarjeta no es válido (debe tener 15 o 16 dígitos).';
      return;
    }
    if (this.cardExpiry.length < 5) {
      this.checkoutError = 'La fecha de expiración debe ser MM/AA.';
      return;
    }
    if (this.cardCvv.length < 3) {
      this.checkoutError = 'El código CVV no es válido (mínimo 3 dígitos).';
      return;
    }

    this.checkoutError = '';
    this.isProcessingPayment = true;

    // Phase 1 of simulation
    this.paymentStatusMessage = 'Validando credenciales bancarias...';
    setTimeout(() => {
      // Phase 2
      this.paymentStatusMessage = 'Consultando fondos suficientes...';
      setTimeout(() => {
        // Phase 3
        this.paymentStatusMessage = 'Aprobando transacción con Pasarela SimpleTicket...';
        setTimeout(() => {
          // Finish payment simulation and submit order to backend
          this.submitOrder();
        }, 1000);
      }, 1000);
    }, 1000);
  }

  submitOrder(): void {
    this.isSubmitting = true;
    this.cartService.checkout(this.shippingAddress).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isProcessingPayment = false;
        this.orderSuccess = true;
        this.createdOrderId = res.id;
        this.cartService.clearCart();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.isProcessingPayment = false;
        this.checkoutError = err.error?.error || 'Error al procesar el pedido. Comprueba tu conexión.';
      }
    });
  }

  trackById(index: number, product: Productos): number {
    return product.id;
  }
}
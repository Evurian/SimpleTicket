import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListaService, Productos } from '../../services/lista.service';
import { CartService } from '../../services/cart.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Productos | undefined;
  quantity: number = 1;
  addedToCart: boolean = false;
  loading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private listService: ListaService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loading = true;
      this.listService.getProductById(+productId).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error al obtener el producto:', error);
          this.loading = false;
        }
      });
    }
  }

  incrementQty(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decrementQty(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart(): void {
    if (this.product) {
      this.cartService.addToCart(this.product, this.quantity);
      this.addedToCart = true;
      setTimeout(() => {
        this.addedToCart = false;
      }, 3000);
    }
  }

  goBack(): void {
    this.router.navigate(['/list']);
  }
}

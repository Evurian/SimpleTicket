import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ListaService, Productos } from '../../services/lista.service';

@Component({
  selector: 'app-detail-product',
  standalone: true,
  imports: [],
  templateUrl: './detail-product.component.html',
  styleUrl: './detail-product.component.css'
})
export class ProductDetailComponent implements OnInit {
  product: Productos | undefined;

  constructor(
    private route: ActivatedRoute,
    private listService: ListaService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.listService.getProductById(+productId).subscribe({
        next: (data) => this.product = data,
        error: (error) => console.error('Error al obtener el producto:', error)
      });
    }
  }
  makeOrder(): void {
    // Lógica para hacer el pedido
    console.log('Pedido realizado para el producto:', this.product);
  }
}

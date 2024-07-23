import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ListaService , Productos} from '../../services/lista.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NgFor, HeaderComponent, FormsModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.sass',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListComponent implements OnInit {
  productos: Productos[] = [];
  filteredProductos: Productos[] = [];
  searchText: string = '';

  constructor(private listService: ListaService, private router: Router) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(): void {
    this.listService.getProducts().subscribe({
      next: (data) => {
        this.productos = data;
        this.filteredProductos = data; // Inicialmente mostrar todos los productos
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
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
  trackById(index: number, product: Productos): number {
    return product.id;
  }
  
}
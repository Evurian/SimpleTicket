import { AsyncPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ListaService , Productos} from '../../services/lista.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [NgFor],
  templateUrl: './list.component.html',
  styleUrl: './list.component.sass',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ListComponent implements OnInit{
  productos: Productos[] = [];

  constructor(private listService: ListaService ){}

  ngOnInit(): void {
      this.getData();
  }
  getData(): void {
    this.listService.getProducts().subscribe({
      next: (data) => this.productos = data,
      error: (error) => console.error('Error al obtener productos:', error)
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ProfileService } from '../../services/accounts/profile.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.sass'
})
export class ProfileComponent implements OnInit {
  profile: any;
  role: string = '';
  orders: any[] = [];
  selectedOrder: any = null;

  // Edit fields
  editMode: boolean = false;
  firstName: string = '';
  lastName: string = '';
  isUpdating: boolean = false;
  updateSuccess: boolean = false;
  updateError: string = '';

  constructor(
    private titleService: Title,
    private profileService: ProfileService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Mi Perfil - SimpleTicket");
    this.loadProfile();
    this.loadOrders();
  }

  loadProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.firstName = data.first_name || '';
        this.lastName = data.last_name || '';
        this.userRole();
      },
      error: (error) => {
        console.error('Error al cargar el perfil:', error);
      }
    });
  }

  loadOrders(): void {
    this.cartService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        if (data.length > 0) {
          this.selectedOrder = data[0]; // Seleccionar el más reciente por defecto
        }
      },
      error: (error) => {
        console.error('Error al cargar pedidos:', error);
      }
    });
  }

  userRole(): void {
    if (this.profile.is_superuser) {
      this.role = 'Admin';
    } else if (this.profile.is_staff) {
      this.role = 'Staff';
    } else {
      this.role = 'Usuario';
    }
  }

  startEdit(): void {
    this.editMode = true;
    this.updateSuccess = false;
    this.updateError = '';
  }

  cancelEdit(): void {
    this.editMode = false;
    this.firstName = this.profile.first_name || '';
    this.lastName = this.profile.last_name || '';
  }

  saveProfile(): void {
    this.isUpdating = true;
    this.updateError = '';
    this.updateSuccess = false;

    const payload = {
      first_name: this.firstName,
      last_name: this.lastName
    };

    this.profileService.updateProfile(payload).subscribe({
      next: (data) => {
        this.profile = data;
        this.editMode = false;
        this.isUpdating = false;
        this.updateSuccess = true;
        setTimeout(() => {
          this.updateSuccess = false;
        }, 3000);
      },
      error: (error) => {
        this.isUpdating = false;
        this.updateError = 'Error al actualizar el perfil. Por favor, intenta de nuevo.';
        console.error('Error actualizando perfil:', error);
      }
    });
  }

  selectOrder(order: any): void {
    this.selectedOrder = order;
  }

  getOrderStatusText(status: string): string {
    switch (status) {
      case 'PENDING': return 'Pendiente';
      case 'SHIPPED': return 'Enviado';
      case 'DELIVERED': return 'Entregado';
      default: return status;
    }
  }

  getOrderStep(status: string): number {
    switch (status) {
      case 'PENDING': return 1;
      case 'SHIPPED': return 2;
      case 'DELIVERED': return 3;
      default: return 1;
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HeaderComponent, FooterComponent],
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {
  activeTab: string = 'dashboard';
  loading: boolean = false;
  
  // Data lists
  stats: any = null;
  orders: any[] = [];
  products: any[] = [];
  categories: any[] = [];
  users: any[] = [];

  // Feedback Alerts
  alertMessage: string = '';
  alertType: 'success' | 'danger' | 'info' = 'success';

  // Product Form properties
  showProductModal: boolean = false;
  isEditingProduct: boolean = false;
  imageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  showNewCategoryInput: boolean = false;
  newCategoryName: string = '';
  
  productForm = {
    id: null as number | null,
    title: '',
    price: 0,
    category: '',
    description: '',
    image: '',
    stock: 100
  };

  // User Form properties
  showUserModal: boolean = false;
  selectedUser: any = null;
  userForm = {
    is_staff: false,
    is_superuser: false
  };

  // Search/Filter properties
  productSearch: string = '';
  userSearch: string = '';
  orderSearch: string = '';

  constructor(
    private adminService: AdminService,
    private titleService: Title,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("SimpleTicket - Panel de Administración");
    this.loadDashboardData();
  }

  showAlert(message: string, type: 'success' | 'danger' | 'info' = 'success'): void {
    this.alertMessage = message;
    this.alertType = type;
    setTimeout(() => {
      this.alertMessage = '';
    }, 4000);
  }

  // Tab navigation
  switchTab(tab: string): void {
    this.activeTab = tab;
    if (tab === 'dashboard') {
      this.loadDashboardData();
    } else if (tab === 'products') {
      this.loadProductsData();
    } else if (tab === 'orders') {
      this.loadOrdersData();
    } else if (tab === 'users') {
      this.loadUsersData();
    }
  }

  // Loaders
  loadDashboardData(): void {
    this.loading = true;
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.showAlert("Error al cargar estadísticas del panel.", "danger");
        this.loading = false;
      }
    });
  }

  loadProductsData(): void {
    this.loading = true;
    this.adminService.getProducts().subscribe({
      next: (res) => {
        this.products = res;
        this.loadCategoriesData();
      },
      error: (err) => {
        console.error(err);
        this.showAlert("Error al cargar productos.", "danger");
        this.loading = false;
      }
    });
  }

  loadCategoriesData(): void {
    this.adminService.getCategories().subscribe({
      next: (res) => {
        this.categories = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  loadOrdersData(): void {
    this.loading = true;
    this.adminService.getOrders().subscribe({
      next: (res) => {
        this.orders = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.showAlert("Error al cargar pedidos.", "danger");
        this.loading = false;
      }
    });
  }

  loadUsersData(): void {
    this.loading = true;
    this.adminService.getUsers().subscribe({
      next: (res) => {
        this.users = res;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.showAlert("Error al cargar usuarios.", "danger");
        this.loading = false;
      }
    });
  }

  // Filters
  get filteredProducts() {
    return this.products.filter(p => 
      p.title.toLowerCase().includes(this.productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(this.productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(this.productSearch.toLowerCase())
    );
  }

  get filteredUsers() {
    return this.users.filter(u => 
      u.username.toLowerCase().includes(this.userSearch.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(this.userSearch.toLowerCase()))
    );
  }

  get filteredOrders() {
    return this.orders.filter(o => 
      o.id.toString().includes(this.orderSearch) ||
      o.username.toLowerCase().includes(this.orderSearch.toLowerCase()) ||
      o.shipping_address.toLowerCase().includes(this.orderSearch.toLowerCase()) ||
      o.status.toLowerCase().includes(this.orderSearch.toLowerCase())
    );
  }

  // Order operations
  changeOrderStatus(orderId: number, status: string): void {
    this.adminService.updateOrderStatus(orderId, status).subscribe({
      next: () => {
        this.showAlert(`Estado del pedido #${orderId} actualizado a ${status}.`, "success");
        this.loadOrdersData();
      },
      error: (err) => {
        console.error(err);
        this.showAlert("No se pudo actualizar el estado del pedido.", "danger");
      }
    });
  }

  // User operations
  openEditUser(user: any): void {
    this.selectedUser = user;
    this.userForm = {
      is_staff: user.is_staff,
      is_superuser: user.is_superuser
    };
    this.showUserModal = true;
  }

  closeUserModal(): void {
    this.showUserModal = false;
    this.selectedUser = null;
  }

  saveUserPermissions(): void {
    if (!this.selectedUser) return;
    
    this.adminService.updateUser(this.selectedUser.id, this.userForm).subscribe({
      next: () => {
        this.showAlert("Permisos de usuario actualizados correctamente.", "success");
        this.closeUserModal();
        this.loadUsersData();
      },
      error: (err) => {
        console.error(err);
        this.showAlert(err.error?.error || "Error al actualizar los permisos del usuario.", "danger");
      }
    });
  }

  deleteUser(userId: number, username: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar al usuario "${username}"?`)) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.showAlert("Usuario eliminado correctamente.", "success");
          this.loadUsersData();
        },
        error: (err) => {
          console.error(err);
          this.showAlert(err.error?.error || "No se pudo eliminar al usuario.", "danger");
        }
      });
    }
  }

  // Product operations
  openAddProduct(): void {
    this.isEditingProduct = false;
    this.imageFile = null;
    this.imagePreviewUrl = null;
    this.showNewCategoryInput = false;
    this.newCategoryName = '';
    this.productForm = {
      id: null,
      title: '',
      price: 0,
      category: '',
      description: '',
      image: '',
      stock: 100
    };
    this.showProductModal = true;
  }

  openEditProduct(product: any): void {
    this.isEditingProduct = true;
    this.imageFile = null;
    this.imagePreviewUrl = product.image;
    this.showNewCategoryInput = false;
    this.newCategoryName = '';
    this.productForm = {
      id: product.id,
      title: product.title,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      stock: product.stock
    };
    this.showProductModal = true;
  }

  closeProductModal(): void {
    this.showProductModal = false;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  toggleNewCategoryInput(): void {
    this.showNewCategoryInput = !this.showNewCategoryInput;
  }

  addNewCategory(): void {
    const name = this.newCategoryName.trim().toLowerCase();
    if (!name) return;
    
    this.adminService.createCategory({ name }).subscribe({
      next: (res) => {
        this.showAlert(`Categoría "${res.name}" creada.`, "success");
        this.loadCategoriesData();
        this.productForm.category = res.name;
        this.newCategoryName = '';
        this.showNewCategoryInput = false;
      },
      error: (err) => {
        console.error(err);
        this.showAlert("Error al crear categoría. Puede que ya exista.", "danger");
      }
    });
  }

  saveProduct(): void {
    if (!this.productForm.title || !this.productForm.category || !this.productForm.description) {
      this.showAlert("Por favor rellena todos los campos obligatorios.", "danger");
      return;
    }

    const formData = new FormData();
    formData.append('title', this.productForm.title);
    formData.append('price', this.productForm.price.toString());
    formData.append('category', this.productForm.category);
    formData.append('description', this.productForm.description);
    formData.append('stock', this.productForm.stock.toString());

    if (this.imageFile) {
      formData.append('image_file', this.imageFile);
    } else if (this.productForm.image) {
      formData.append('image', this.productForm.image);
    }

    if (this.isEditingProduct && this.productForm.id) {
      this.adminService.updateProduct(this.productForm.id, formData).subscribe({
        next: () => {
          this.showAlert("Producto actualizado correctamente.", "success");
          this.closeProductModal();
          this.loadProductsData();
        },
        error: (err) => {
          console.error(err);
          this.showAlert("Error al actualizar producto.", "danger");
        }
      });
    } else {
      this.adminService.createProduct(formData).subscribe({
        next: () => {
          this.showAlert("Producto creado correctamente.", "success");
          this.closeProductModal();
          this.loadProductsData();
        },
        error: (err) => {
          console.error(err);
          this.showAlert("Error al crear producto.", "danger");
        }
      });
    }
  }

  deleteProduct(productId: number, title: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${title}"?`)) {
      this.adminService.deleteProduct(productId).subscribe({
        next: () => {
          this.showAlert("Producto eliminado correctamente.", "success");
          this.loadProductsData();
        },
        error: (err) => {
          console.error(err);
          this.showAlert("No se pudo eliminar el producto.", "danger");
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/accounts/session/session-service.service';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  cartCount = 0;
  isDark = false;

  constructor(
    private sessionService: SessionService,
    private cartService: CartService,
    private themeService: ThemeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    
    this.cartService.cartItems$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });

    this.themeService.isDarkMode$.subscribe(mode => {
      this.isDark = mode;
    });
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.sessionService.isConnected();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.sessionService.isDisconnect();
    this.isLoggedIn = false;
    this.router.navigate(['/sign-in']);
  }
}
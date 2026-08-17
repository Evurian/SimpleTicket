import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../services/accounts/session/session-service.service';
import { ProfileService } from '../../services/accounts/profile.service';
import { CartService } from '../../services/cart.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  cartCount = 0;
  isDark = false;

  constructor(
    private sessionService: SessionService,
    private profileService: ProfileService,
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
    if (this.isLoggedIn) {
      this.profileService.getProfile().subscribe({
        next: (profile) => {
          this.isAdmin = profile.is_staff || profile.is_superuser;
        },
        error: () => {
          this.isAdmin = false;
        }
      });
    } else {
      this.isAdmin = false;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    this.sessionService.isDisconnect();
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/sign-in']);
  }
}
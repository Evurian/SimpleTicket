import { Component, OnInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { SignInService } from '../../services/accounts/sign-in/sign-in.service';

declare var google: any;

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink
  ],
  templateUrl: './sign-in.component.html',
})

export class SignInComponent implements OnInit {

  // Variables
  signInForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  // Constructor
  constructor
    (
      private titleService: Title,
      private fb: FormBuilder,
      private router: Router,
      private signInService: SignInService,
      private ngZone: NgZone,
      @Inject(PLATFORM_ID) private platformId: Object
    ) {
    this.signInForm = this.fb.group
      ({
        username: ['', Validators.required],
        password: ['', Validators.required]
      });
  }

  // Init
  ngOnInit(): void {
    this.titleService.setTitle("Sign In");
    if (isPlatformBrowser(this.platformId)) {
      this.initGoogleSignIn();
    }
  }

  // Initialize Google Sign-In
  initGoogleSignIn(): void {
    if (typeof google !== 'undefined') {
      const btnElement = document.getElementById('google-btn');
      if (!btnElement) {
        setTimeout(() => this.initGoogleSignIn(), 100);
        return;
      }
      google.accounts.id.initialize({
        client_id: environment.googleClientId,
        callback: this.handleGoogleSignIn.bind(this)
      });
      google.accounts.id.renderButton(
        btnElement,
        { theme: 'outline', size: 'large', width: 350, text: 'signin_with', shape: 'rectangular' }
      );
    } else {
      setTimeout(() => this.initGoogleSignIn(), 500);
    }
  }

  // Handle Google OAuth callback
  handleGoogleSignIn(response: any): void {
    const idToken = response.credential;
    this.ngZone.run(() => {
      this.signInService.googleSignIn(idToken).subscribe({
        next: (res) => {
          this.successMessage = '¡Inicio de sesión exitoso con Google!';
          this.errorMessage = null;
          localStorage.setItem('token', res.token);
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        },
        error: (err) => {
          this.successMessage = null;
          this.errorMessage = err.error?.error || 'Error al iniciar sesión con Google.';
        }
      });
    });
  }

  // Method | Sign In
  signIn() {
    if (this.signInForm.invalid) {
      this.errorMessage = "Please fill out the form correctly.";
      return;
    }

    const { username, password } = this.signInForm.value;

    this.signInService.signIn({ username, password }).subscribe({
      next: (response) => {
        this.successMessage = 'Sign In successful !';
        this.errorMessage = null;
        localStorage.setItem('token', response.token);
        setTimeout(() => {
          this.router.navigate(['/profile']);
        }, 2000);
      },
      error: (error) => {
        this.successMessage = null;
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    });
  }

}
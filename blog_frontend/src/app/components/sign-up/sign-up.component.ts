import { Component, OnInit, NgZone, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { SignUpService } from '../../services/accounts/sign-up/sign-up.service';
import { SignInService } from '../../services/accounts/sign-in/sign-in.service';

declare var google: any;

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterLink
  ],
  templateUrl: './sign-up.component.html',
})

export class SignUpComponent implements OnInit {

  // Variables
  signUpForm: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  // Constructor
  constructor
  (
    private titleService: Title,
    private fb: FormBuilder,
    private router: Router,
    private signUpService: SignUpService,
    private signInService: SignInService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) 
  {
    this.signUpForm = this.fb.group
    ({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  //Init
  ngOnInit(): void {
    this.titleService.setTitle("Sign Up");
    if (isPlatformBrowser(this.platformId)) {
      this.initGoogleSignIn();
    }
  }

  // Initialize Google Sign-In
  initGoogleSignIn(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: this.handleGoogleSignIn.bind(this)
      });
      google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme: 'outline', size: 'large', width: '100%', text: 'signup_with', shape: 'rectangular' }
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
          this.successMessage = '¡Registro e inicio de sesión exitoso con Google!';
          this.errorMessage = null;
          localStorage.setItem('token', res.token);
          setTimeout(() => {
            this.router.navigate(['/profile']);
          }, 1500);
        },
        error: (err) => {
          this.successMessage = null;
          this.errorMessage = err.error?.error || 'Error al autenticar con Google.';
        }
      });
    });
  }

  // Method | Sign Up
  signUp() {

    if (this.signUpForm.invalid) {
      this.errorMessage = "Please fill out the form correctly.";
      return;
    }

    if (this.signUpForm.value.password !== this.signUpForm.value.confirmPassword) {
      this.errorMessage = "Passwords do not match.";
      return;
    }

    const { username, email, password, confirmPassword } = this.signUpForm.value;

    this.signUpService.signUp({ username, email, password, confirm_password: confirmPassword }).subscribe({
      next: (response) => {
        this.successMessage = 'User registered successfully';
        this.errorMessage = null;
        this.signUpForm.reset();
        setTimeout(() => {
          this.router.navigate(['/sign-in']);
        }, 2000);
      },
      error: (error) => {
        this.errorMessage = 'There was an error ! ' + (error.error?.message || 'Error creating account');
        this.successMessage = null;
      }
    });
  }

}
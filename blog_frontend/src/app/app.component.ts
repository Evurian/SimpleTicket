import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HttpClientModule,
    RouterLink, 
    RouterLinkActive, 
    CommonModule,
    FormsModule,

  ],
  templateUrl: './app.component.html',
  styleUrl: '../styles/styles.css'
})

export class AppComponent {
  title = 'Blog';
}
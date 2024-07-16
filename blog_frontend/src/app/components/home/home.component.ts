import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../services/accounts/guard/user-guard/user-guard-service.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './home.component.html',
})

export class HomeComponent implements OnInit{
  isLoggedIn: boolean = false;

  // Constructor
  constructor(private titleService: Title, private authService: AuthService) { }

  // Init
  ngOnInit(): void {
    this.titleService.setTitle("Home");
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.loggedInStatus.subscribe(status => {
      this.isLoggedIn = status;
      this.updatePage();
    });
  }

  updatePage() {
    // Logic to update the page based on login status
    if (this.isLoggedIn) {
      console.log('User is logged in');
      // Update your page content or perform actions
    } else {
      console.log('User is logged out');
      // Update your page content or perform actions
    }
  }

}
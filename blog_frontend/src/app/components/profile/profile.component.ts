import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/accounts/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  user: any = {};
  purchases: any[] = [];
  isEditing: boolean = false;

  constructor(private userService: UserService, private titleService:Title) { }

  ngOnInit(): void {
    this.loadUser();
    this.titleService.setTitle("Profile");
  }

  loadUser(): void {
    this.userService.getUser().subscribe(data => {
      this.user = data;
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  saveChanges(): void {
    this.userService.updateUser(this.user).subscribe(data => {
      this.user = data;
      this.isEditing = false;
    });
  }
}

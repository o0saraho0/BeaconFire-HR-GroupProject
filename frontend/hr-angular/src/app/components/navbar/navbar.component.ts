import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  constructor(private router: Router) {}

  isLoggedIn(): boolean {
    // Check if token exists in localStorage
    return !!localStorage.getItem('token');
  }

  onLogoutClick(): void {
    this.router.navigate(['/logout']);
  }
}

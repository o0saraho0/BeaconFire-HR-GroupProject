import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  template: '', // Empty template since this is just a functional component
})
export class LogoutComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.logout();
  }

  private logout(): void {
    // First, make the logout API call
    this.http.post('http://localhost:3000/api/user/logout', {}).subscribe({
      next: () => {
        // Clear the token from localStorage
        localStorage.removeItem('token');
        // Redirect to login page
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Even if the API call fails, clear local storage and redirect
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
    });
  }
}

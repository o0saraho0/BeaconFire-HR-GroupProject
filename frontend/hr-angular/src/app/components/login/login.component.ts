import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login data:', this.loginForm.value);
      this.errorMessage = '';
      // Implement login functionality here
      this.http
        .post('http://localhost:3000/api/user/login-hr', this.loginForm.value)
        .subscribe({
          next: (res: any) => {
            if (res.token) {
              localStorage.setItem('token', res.token);
            }
            this.router.navigate(['/home']);
          },
          error: (e) => {
            console.error('Login failed: ', e);
            this.errorMessage =
              e.error?.message || 'Login failed. Please try again.';
          },
        });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import axios, { AxiosError } from 'axios';

@Component({
  selector: 'app-hiring-management',
  templateUrl: './hiring-management.component.html',
  styleUrls: ['./hiring-management.component.css'],
})
export class HiringManagementComponent implements OnInit {
  hiringForm!: FormGroup;
  registrations: Array<any> = []; // Declare the `registrations` property as an empty array

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.hiringForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    // Fetch registration data when the component initializes
    this.fetchRegistrations();
  }

  async onSubmit(): Promise<void> {
    if (this.hiringForm.valid) {
      const formData = this.hiringForm.value;

      try {
        const response = await axios.post(
          'http://localhost:3000/api/registration/register',
          {
            first_name: formData.firstname,
            last_name: formData.lastname,
            email: formData.email,
          }
        );
        console.log('Success:', response.data);
        alert('Registration successful!');
        this.fetchRegistrations(); // Refresh the data after successful registration
      } catch (error) {
        this.handleError(error);
      }
    } else {
      alert('Please fill out all fields correctly.');
    }
  }

  async fetchRegistrations(): Promise<void> {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/registration/all'
      );
      this.registrations = response.data; // Store the fetched data
      console.log(this.registrations)
    } catch (error) {
      this.handleError(error);
    }
  }

  // Centralized error handling
  private handleError(error: unknown): void {
    if (axios.isAxiosError(error)) {
      console.error('Error:', error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } else {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    }
  }
}

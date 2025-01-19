import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';

interface Application {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  feedback?: string;
}

@Component({
  selector: 'app-hiring-management',
  templateUrl: './hiring-management.component.html',
  styleUrls: ['./hiring-management.component.css'],
})
export class HiringManagementComponent implements OnInit {
  hiringForm!: FormGroup;
  registrations: Array<any> = [];
  pendingApplications: Application[] = [];
  rejectedApplications: Application[] = [];
  approvedApplications: Application[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.hiringForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    // Fetch initial data
    this.fetchRegistrations();
    this.loadApplications();
  }

  onSubmit(): void {
    if (this.hiringForm.valid) {
      const formData = this.hiringForm.value;

      this.http
        .post(
          'http://localhost:3000/api/registration/generate-and-send-email',
          {
            first_name: formData.firstname,
            last_name: formData.lastname,
            email: formData.email,
          }
        )
        .subscribe({
          next: (response) => {
            console.log('Success:', response);
            alert('Registration successful!');
            this.fetchRegistrations();
          },
          error: (error) => this.handleError(error),
        });
    } else {
      alert('Please fill out all fields correctly.');
    }
  }

  fetchRegistrations(): void {
    this.http.get('http://localhost:3000/api/registration/all').subscribe({
      next: (response: any) => {
        this.registrations = response;
        console.log(this.registrations);
      },
      error: (error) => this.handleError(error),
    });
  }

  loadApplications(): void {
    this.http
      .get<{ applications: Application[] }>(
        'http://localhost:3000/api/onboarding/applications'
      )
      .subscribe({
        next: (res) => {
          this.pendingApplications = res.applications.filter(
            (app) => app.status === 'Pending'
          );
          this.rejectedApplications = res.applications.filter(
            (app) => app.status === 'Rejected'
          );
          this.approvedApplications = res.applications.filter(
            (app) => app.status === 'Approved'
          );
        },
        error: (error) => this.handleError(error),
      });
  }

  viewApplication(applicationId: number): void {
    window.open(`/onboarding/application/${applicationId}`, '_blank');
  }

  private handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      console.error('Error:', error.error || error.message);
      alert(`Error: ${error.error?.error || error.message}`);
    } else {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred.');
    }
  }
}

import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

interface Application {
  id: number;
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
        .post('http://localhost:3000/api/registration/register', {
          first_name: formData.firstname,
          last_name: formData.lastname,
          email: formData.email,
        })
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

  approveApplication(applicationId: number): void {
    this.http
      .post(
        `http://localhost:3000/api/onboarding/applications/${applicationId}/approve`,
        {}
      )
      .subscribe({
        next: () => {
          this.loadApplications();
        },
        error: (error) => this.handleError(error),
      });
  }

  openRejectDialog(applicationId: number): void {
    const dialogRef = this.dialog.open(RejectDialogComponent, {
      width: '400px',
      data: { applicationId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http
          .post(
            `http://localhost:3000/api/onboarding/applications/${applicationId}/reject`,
            { feedback: result.feedback }
          )
          .subscribe({
            next: () => {
              this.loadApplications();
            },
            error: (error) => this.handleError(error),
          });
      }
    });
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

@Component({
  selector: 'app-reject-dialog',
  template: `
    <h2 mat-dialog-title>Reject Application</h2>
    <mat-dialog-content>
      <form [formGroup]="rejectForm">
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Feedback</mat-label>
          <textarea
            matInput
            formControlName="feedback"
            rows="4"
            placeholder="Enter rejection feedback"
          ></textarea>
          <mat-error *ngIf="rejectForm.get('feedback')?.hasError('required')">
            Feedback is required
          </mat-error>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-raised-button
        color="warn"
        [disabled]="rejectForm.invalid"
        (click)="onSubmit()"
      >
        Reject
      </button>
    </mat-dialog-actions>
  `,
})
export class RejectDialogComponent {
  rejectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<RejectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { applicationId: number }
  ) {
    this.rejectForm = this.fb.group({
      feedback: ['', Validators.required],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.rejectForm.valid) {
      this.dialogRef.close(this.rejectForm.value);
    }
  }
}

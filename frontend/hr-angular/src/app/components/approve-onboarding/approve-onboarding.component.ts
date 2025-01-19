import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

interface Address {
  building: string;
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface Reference {
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
  email: string;
  relationship: string;
}

interface EmergencyContact {
  first_name: string;
  last_name: string;
  middle_name: string;
  phone: string;
  email: string;
  relationship: string;
  _id: string;
}

interface Application {
  _id: string;
  user_id: string;
  status: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  preferred_name: string;
  current_address: Address;
  cell_phone: string;
  work_phone: string;
  car_make: string;
  car_model: string;
  car_color: string;
  ssn: string;
  dob: string;
  gender: string;
  visa_type: string;
  visa_start_date: string;
  visa_end_date: string;
  driver_licence_number: string;
  driver_license_expire_date: string;
  reference: Reference;
  emergency_contacts: EmergencyContact[];
  profile_picture_url: string;
  driver_licence_url: string;
  work_auth_url: string;
}

@Component({
  selector: 'app-approve-onboarding',
  templateUrl: './approve-onboarding.component.html',
  styleUrls: ['./approve-onboarding.component.css'],
})
export class ApproveOnboardingComponent implements OnInit {
  application: Application | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const applicationId = params['applicationId'];
      this.fetchApplication(applicationId);
    });
  }

  private fetchApplication(applicationId: string): void {
    this.http
      .get<{ application: Application }>(
        `http://localhost:3000/api/onboarding/application/${applicationId}`
      )
      .subscribe({
        next: (response) => {
          this.application = response.application;
        },
        error: (error) => {
          console.error('Error fetching application:', error);
          // Handle error appropriately
        },
      });
  }

  approveApplication(): void {
    if (!this.application) return;
    ///api/onboarding/application/approve/678bd91941237c1ad3491345
    this.http
      .post(
        `http://localhost:3000/api/onboarding/application/approve/${this.application._id}`,
        {}
      )
      .subscribe({
        next: () => {
          alert('Application approved successfully');
          this.fetchApplication(this.application!._id);
        },
        error: (error) => {
          console.error('Error approving application:', error.error.message);
          alert(`Error approving application: ${error.error.message}`);
        },
      });
  }

  openRejectDialog(): void {
    if (!this.application) return;

    const dialogRef = this.dialog.open(RejectDialogComponent, {
      width: '400px',
      data: { applicationId: this.application._id },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http
          .post(
            `http://localhost:3000/api/onboarding/application/reject/${
              this.application!._id
            }`,
            { feedback: result.feedback }
          )
          .subscribe({
            next: () => {
              alert('Application rejected successfully');
              this.fetchApplication(this.application!._id);
            },
            error: (error) => {
              console.error(
                'Error rejecting application:',
                error.error.message
              );
              alert(`Error rejecting application: ${error.error.message}`);
            },
          });
      }
    });
  }
}

// Keep the RejectDialogComponent in the same file
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
    @Inject(MAT_DIALOG_DATA) public data: { applicationId: string }
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

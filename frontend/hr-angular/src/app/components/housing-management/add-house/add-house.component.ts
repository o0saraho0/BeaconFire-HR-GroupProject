import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-add-house',
  templateUrl: './add-house.component.html',
  styleUrls: ['./add-house.component.css']
})
export class AddHouseDialogComponent {
  houseForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddHouseDialogComponent>,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.houseForm = this.fb.group({
      building: [''],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      landlordFirstName: ['', Validators.required],
      landlordLastName: ['', Validators.required],
      landlordPhone: ['', Validators.required],
      landlordEmail: ['', [Validators.required, Validators.email]],
      beds: [0, [Validators.required, Validators.min(0)]],
      mattresses: [0, [Validators.required, Validators.min(0)]],
      tables: [0, [Validators.required, Validators.min(0)]],
      chairs: [0, [Validators.required, Validators.min(0)]]
    });
  }

  onSubmit(): void {
    if (this.houseForm.valid) {
      const formValue = this.houseForm.value;
      const houseData = {
        address: {
          building: formValue.building,
          street: formValue.street,
          city: formValue.city,
          state: formValue.state,
          zip: formValue.zip
        },
        landlord: {
          first_name: formValue.landlordFirstName,
          last_name: formValue.landlordLastName,
          phone_number: formValue.landlordPhone,
          email: formValue.landlordEmail
        },
        beds: formValue.beds,
        mattresses: formValue.mattresses,
        tables: formValue.tables,
        chairs: formValue.chairs,
        tenants: []
      };

      this.http.post(`${environment.apiUrl}/api/houses`, houseData)
        .subscribe({
          next: (response: any) => {
            if (response && response.house) {
              console.log('House created successfully:', response);
              this.dialogRef.close(response.house);
            } else {
              console.error('Invalid response format:', response);
            }
          },
          error: (error) => {
            console.error('Error creating house:', error);
            if (error.status === 500) {
              console.error('Server error details:', error.error);
            }
          }
        });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
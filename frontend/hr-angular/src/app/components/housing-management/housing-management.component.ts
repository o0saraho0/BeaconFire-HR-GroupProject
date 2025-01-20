import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmployeeService } from '../../services/employees.service';
import { AddHouseDialogComponent } from './add-house/add-house.component';

interface Tenant {
  id: string;
  user_id: {
    _id: string;
    email: string;
    username: string;
  }; first_name: string;
  last_name: string;
  middle_name?: string;
  preferred_name?: string;
  cell_phone: string;
  work_phone?: string;
  email: string;
  car_make?: string;
  car_model?: string;
  car_color?: string;
}

interface Comment {
  description: string;
  createdBy: string;
  timestamp: Date;
}

interface Report {
  title: string;
  description: string;
  createdBy: string;
  timestamp: Date;
  status: 'Open' | 'In Progress' | 'Closed';
  comments: Comment[];
}

interface House {
  _id: string;
  address: {
    building: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  landlord: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
  };
  tenants: (string | Tenant)[];
  beds: number;
  mattresses: number;
  tables: number;
  chairs: number;
  reports?: Report[];
}

@Component({
  selector: 'app-housing-management',
  templateUrl: './housing-management.component.html',
  styleUrls: ['./housing-management.component.css']
})
export class HousingManagementComponent implements OnInit {
  houses: House[] = [];
  expandedHouseId: string | null = null;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.loadHouses();
  }
  private tenantDetailsMap = new Map<string, any>();

  getTenantDisplayName(tenant: Tenant | string): string {
    const tenantDetails = typeof tenant === 'string'
      ? this.tenantDetailsMap.get(tenant)
      : tenant;

    if (!tenantDetails) {
      return 'Loading...';
    }

    if (tenantDetails.preferred_name) {
      return tenantDetails.preferred_name;
    }

    const middleName = tenantDetails.middle_name ? ` ${tenantDetails.middle_name} ` : ' ';
    return `${tenantDetails.first_name}${middleName}${tenantDetails.last_name}`;
  }

  getTenantDetails(tenantId: string | Tenant): Tenant | null {
    if (typeof tenantId === 'string') {
      return this.tenantDetailsMap.get(tenantId) || null;
    }
    return tenantId;
  }

  isString(value: any): boolean {
    return typeof value === 'string';
  }
  loadHouses() {
    this.http.get<House[]>('http://localhost:3000/api/houses').subscribe({
      next: (houses) => {
        this.houses = houses;
        this.houses.forEach(house => {
          if (house.tenants && Array.isArray(house.tenants)) {
            console.log('house tenants', house.tenants);
            house.tenants.forEach(tenantId => {
              if (typeof tenantId === 'string') {
                this.loadTenantDetails(tenantId);
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error loading houses:', error);
        this.snackBar.open('Error loading houses', 'Close', { duration: 3000 });
      }
    });
  }

  loadTenantDetails(userId: string) {
    this.employeeService.getEmployeeById(userId).subscribe({
      next: (employee) => {
        this.tenantDetailsMap.set(userId, employee);
      },
      error: (error) => {
        console.error('Error loading tenant details:', error);
        this.tenantDetailsMap.set(userId, { first_name: 'Error', last_name: 'Loading' });
      }
    });
  }
  getCarInfo(tenant: Tenant): string {
    const carInfo = [
      tenant.car_make,
      tenant.car_model,
      tenant.car_color ? `(${tenant.car_color})` : ''
    ].filter(item => item).join(' ');
    return carInfo || 'N/A';
  }
  toggleHouseDetails(houseId: string): void {
    this.expandedHouseId = this.expandedHouseId === houseId ? null : houseId;
  }

  openAddHouseDialog(): void {
    const dialogRef = this.dialog.open(AddHouseDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.http.post<{ message: string, house: House }>('http://localhost:3000/api/houses', result).subscribe({
          next: (response) => {
            this.houses.push(response.house);
            this.snackBar.open('House added successfully', 'Close', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error adding house:', error);
            this.snackBar.open('Error adding house', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  deleteHouse(houseId: string): void {
    if (confirm('Are you sure you want to delete this house?')) {
      this.http.delete(`http://localhost:3000/api/houses/${houseId}`).subscribe({
        next: () => {
          this.houses = this.houses.filter(house => house._id !== houseId);
          this.snackBar.open('House deleted successfully', 'Close', { duration: 3000 });
        },
        error: (error: Error) => {
          console.error('Error deleting house:', error);
          this.snackBar.open('Error deleting house', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
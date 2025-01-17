import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeeService } from '../../services/employees.service';
import { Employee } from '../../store/employees/employees.state';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: Employee | null = null;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const employeeId = this.route.snapshot.paramMap.get('employeeId');
    console.log('Retrieved Employee ID:', employeeId);
  
    if (employeeId) {
      this.employeeService.getEmployeeById(employeeId).subscribe(
        (data) => {
          this.employee = data;
          console.log('Fetched Employee Data:', this.employee); // Debug fetched data
        },
        (error) => {
          console.error('Error fetching employee data:', error); // Log any errors
        }
      );
    } else {
      console.error('Employee ID is null or invalid:', employeeId); // Handle invalid or null employeeId
    }
  }
  
  
  
}

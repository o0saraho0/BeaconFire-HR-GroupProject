import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmployeeService } from '../../services/employees.service';
import { Employee } from '../../store/employees/employees.state';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  employee: Employee | null = null;
  private routeSub: Subscription | null = null;
  private dataSub: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe((params) => {
      const employeeId = params['employeeId'];

      if (employeeId) {
        this.dataSub?.unsubscribe();

        this.dataSub = this.employeeService.getEmployeeById(employeeId).subscribe(
          (data) => {
            this.employee = data;
            console.log('Fetched Employee Data:', this.employee);
          },
          (error) => {
            console.error('Error fetching employee data:', error);
          }
        );
      } else {
        console.error('Employee ID is null or invalid:', employeeId);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSub?.unsubscribe();
    this.dataSub?.unsubscribe();
  }
}
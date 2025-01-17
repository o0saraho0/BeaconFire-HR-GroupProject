import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { Employee } from '../../store/employees/employees.state';
import {
  fetchEmployees,
} from '../../store/employees/employees.actions';
import {
  selectAllEmployees,
  selectEmployeesLoading,
  selectEmployeesError,
} from '../../store/employees/employees.selectors';

@Component({
  selector: 'app-employee-profiles',
  templateUrl: './employee-profiles.component.html',
  styleUrls: ['./employee-profiles.component.css'],
})
export class EmployeeProfilesComponent implements OnInit {
  employees$: Observable<Employee[]> = of([]); 
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);
  filteredEmployees: Employee[] = []; 
  displayedColumns: string[] = ['name', 'ssn', 'visa_type', 'cell_phone', 'email']; 

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Fetch employees and set up loading and error states
    this.employees$ = this.store.select(selectAllEmployees);
    this.loading$ = this.store.select(selectEmployeesLoading);
    this.error$ = this.store.select(selectEmployeesError);

    // Dispatch action to fetch employees
    this.store.dispatch(fetchEmployees());

    // Subscribe to the employee list and initialize filteredEmployees
    this.employees$.subscribe((employees) => {
      this.filteredEmployees = employees; 
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.employees$.subscribe((employees) => {
      this.filteredEmployees = employees.filter((employee) =>
        `${employee.first_name} ${employee.last_name}`
          .toLowerCase()
          .includes(filterValue)
      );
    });
  }
}

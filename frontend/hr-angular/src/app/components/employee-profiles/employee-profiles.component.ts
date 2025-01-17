import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-employee-profiles',
  templateUrl: './employee-profiles.component.html',
  styleUrls: ['./employee-profiles.component.css'],
})
export class EmployeeProfilesComponent implements OnInit {
  employees$: Observable<Employee[]> = of([]);
  loading$: Observable<boolean> = of(false);
  error$: Observable<string | null> = of(null);
  dataSource = new MatTableDataSource<Employee>();
  displayedColumns: string[] = ['name', 'ssn', 'visa_type', 'cell_phone', 'email'];
  totalEmployees: number = 0;
  sortedEmployees: Employee[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator; 

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Fetch employees and set up loading and error states
    this.employees$ = this.store.select(selectAllEmployees);
    this.loading$ = this.store.select(selectEmployeesLoading);
    this.error$ = this.store.select(selectEmployeesError);

    // Dispatch action to fetch employees
    this.store.dispatch(fetchEmployees());

    // Define a custom filterPredicate for filtering by multiple fields
    this.dataSource.filterPredicate = (data: Employee, filter: string) => {
      const searchString = `${data.first_name} ${data.middle_name || ''} ${data.last_name} ${data.preferred_name || ''}`
        .trim()
        .toLowerCase();
      return searchString.includes(filter);
    };

    // Subscribe to the employee list and update the data source
    this.employees$.subscribe((employees) => {
      this.totalEmployees = employees.length;

      this.sortedEmployees = [...employees].sort((a, b) =>
        a.last_name.localeCompare(b.last_name)
      );

      this.dataSource.data = this.sortedEmployees;
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue; 
  }
}

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
  dataSource = new MatTableDataSource<Employee>(); // MatTableDataSource for pagination
  displayedColumns: string[] = ['name', 'ssn', 'visa_type', 'cell_phone', 'email'];

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginator reference

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Fetch employees and set up loading and error states
    this.employees$ = this.store.select(selectAllEmployees);
    this.loading$ = this.store.select(selectEmployeesLoading);
    this.error$ = this.store.select(selectEmployeesError);

    console.log(this.employees$);

    // Dispatch action to fetch employees
    this.store.dispatch(fetchEmployees());

    // Subscribe to the employee list and update the data source
    this.employees$.subscribe((employees) => {
      this.dataSource.data = employees; // Set table data
      this.dataSource.paginator = this.paginator; // Assign paginator
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue; // Apply filter to the data source
  }
}

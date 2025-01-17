import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as EmployeeActions from './employees.actions';
import { EmployeeService } from '../../services/employees.service';

@Injectable()
export class EmployeesEffects {
  constructor(private actions$: Actions, private employeeService: EmployeeService) {}

  // Effect for fetching all employees
  fetchEmployees$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.fetchEmployees),
      mergeMap(() =>
        this.employeeService.getAllEmployees().pipe(
          map((employees) => EmployeeActions.fetchEmployeesSuccess({ employees })),
          catchError((error) =>
            of(EmployeeActions.fetchEmployeesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Effect for fetching a single employee by ID
  fetchEmployeeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeeActions.fetchEmployeeById),
      mergeMap((action) =>
        this.employeeService.getEmployeeById(action.id).pipe(
          map((employee) => EmployeeActions.fetchEmployeeByIdSuccess({ employee })),
          catchError((error) =>
            of(EmployeeActions.fetchEmployeeByIdFailure({ error: error.message }))
          )
        )
      )
    )
  );
}

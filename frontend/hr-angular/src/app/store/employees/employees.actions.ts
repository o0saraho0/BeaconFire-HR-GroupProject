import { createAction, props } from '@ngrx/store';
import { Employee } from './employees.state';

// Actions for fetching all employees
export const fetchEmployees = createAction('[Employees] Fetch Employees');
export const fetchEmployeesSuccess = createAction(
  '[Employees] Fetch Employees Success',
  props<{ employees: Employee[] }>()
);
export const fetchEmployeesFailure = createAction(
  '[Employees] Fetch Employees Failure',
  props<{ error: string }>()
);

// Actions for fetching a single employee by ID
export const fetchEmployeeById = createAction(
  '[Employees] Fetch Employee By ID',
  props<{ id: number }>()
);
export const fetchEmployeeByIdSuccess = createAction(
  '[Employees] Fetch Employee By ID Success',
  props<{ employee: Employee }>()
);
export const fetchEmployeeByIdFailure = createAction(
  '[Employees] Fetch Employee By ID Failure',
  props<{ error: string }>()
);

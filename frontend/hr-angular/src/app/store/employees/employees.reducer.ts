import { createReducer, on } from '@ngrx/store';
import * as EmployeeActions from './employees.actions';
import { EmployeesState, initialState } from './employees.state';

export const employeesReducer = createReducer(
  initialState,
  on(EmployeeActions.fetchEmployees, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EmployeeActions.fetchEmployeesSuccess, (state, { employees }) => ({
    ...state,
    loading: false,
    employees: employees,
  })),
  on(EmployeeActions.fetchEmployeesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  })),
  on(EmployeeActions.fetchEmployeeById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(EmployeeActions.fetchEmployeeByIdSuccess, (state, { employee }) => ({
    ...state,
    loading: false,
    selectedEmployee: employee,
  })),
  on(EmployeeActions.fetchEmployeeByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error: error,
  }))
);

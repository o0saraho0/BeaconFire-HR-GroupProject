import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EmployeesState } from './employees.state';

export const selectEmployeesState = createFeatureSelector<EmployeesState>('employees');

export const selectAllEmployees = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.employees
);

export const selectSelectedEmployee = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.selectedEmployee
);

export const selectEmployeesLoading = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.loading
);

export const selectEmployeesError = createSelector(
  selectEmployeesState,
  (state: EmployeesState) => state.error
);

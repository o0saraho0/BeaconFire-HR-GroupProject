import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  token: string | null;
  error: string | null;
  isAuthenticated: boolean;
}

export const initialState: AuthState = {
  token: localStorage.getItem('token'),
  error: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

// reducer logic
export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginSuccess, (state, { token }) => ({
    ...state,
    token,
    error: null,
    isAuthenticated: true,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    isAuthenticated: false,
  })),
  on(AuthActions.logout, (state) => ({
    ...state,
    token: null,
    error: null,
    isAuthenticated: false,
  }))
);

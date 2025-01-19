import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      exhaustMap((action) =>
        this.http
          .post<{ token: string }>(
            'http://localhost:3000/api/user/login-hr',
            action.credentials
          )
          .pipe(
            map((response) =>
              AuthActions.loginSuccess({ token: response.token })
            ),
            catchError((error) =>
              of(
                AuthActions.loginFailure({
                  error:
                    error.error?.message || 'Login failed. Please try again.',
                })
              )
            )
          )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ token }) => {
          localStorage.setItem('token', token);
          this.router.navigate(['/home']);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        exhaustMap(() =>
          this.http.post('http://localhost:3000/api/user/logout', {}).pipe(
            tap(() => {
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
            }),
            catchError(() => {
              localStorage.removeItem('token');
              this.router.navigate(['/login']);
              return of(undefined);
            })
          )
        )
      ),
    { dispatch: false }
  );

  // ... existing code ...

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router
  ) {}
}

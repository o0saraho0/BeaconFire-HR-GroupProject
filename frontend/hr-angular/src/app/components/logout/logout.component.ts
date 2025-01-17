import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { logout } from '../../store/auth/auth.actions';

@Component({
  selector: 'app-logout',
  template: '', // Empty template since this is just a functional component
})
export class LogoutComponent implements OnInit {
  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(logout());
  }
}

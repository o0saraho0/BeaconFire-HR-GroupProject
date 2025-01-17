import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Angular Material Modules
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';

// Components
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeeProfilesComponent } from './components/employee-profiles/employee-profiles.component';
import { VisaStatusManagementComponent } from './components/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './components/hiring-management/hiring-management.component';
import { HousingManagementComponent } from './components/housing-management/housing-management.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EmployeeProfilesComponent,
    VisaStatusManagementComponent,
    HiringManagementComponent,
    HousingManagementComponent,
    NavbarComponent,
    LoginComponent,
    EmployeeDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
    BrowserAnimationsModule,
    HttpClientModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    FormsModule,
    MatIconModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms'
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from '../environments/environment';
import { HomeComponent } from './components/home/home.component';
import { EmployeeProfilesComponent } from './components/employee-profiles/employee-profiles.component';
import { VisaStatusManagementComponent } from './components/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './components/hiring-management/hiring-management.component';
import { HousingManagementComponent } from './components/housing-management/housing-management.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { FormControl } from '@angular/forms';

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
    EmployeeDetailComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    StoreModule.forRoot({}, {}),
    EffectsModule.forRoot([]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

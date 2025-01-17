import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { EmployeeProfilesComponent } from './components/employee-profiles/employee-profiles.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { VisaStatusManagementComponent } from './components/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './components/hiring-management/hiring-management.component';
import { HousingManagementComponent } from './components/housing-management/housing-management.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent},
  { path: 'employee-profiles', component: EmployeeProfilesComponent, children: [
    {
      path: ':employeeId', 
      component: EmployeeDetailComponent
    }
  ]},
  { path: 'visa-status', component: VisaStatusManagementComponent },
  { path: 'hiring', component: HiringManagementComponent },
  { path: 'housing', component: HousingManagementComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

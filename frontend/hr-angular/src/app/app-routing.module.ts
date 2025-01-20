import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { HomeComponent } from './components/home/home.component';
import { EmployeeProfilesComponent } from './components/employee-profiles/employee-profiles.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { VisaStatusManagementComponent } from './components/visa-status-management/visa-status-management.component';
import { HiringManagementComponent } from './components/hiring-management/hiring-management.component';
import { HousingManagementComponent } from './components/housing-management/housing-management.component';
import { ApproveOnboardingComponent } from './components/approve-onboarding/approve-onboarding.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent },
  {
    path: 'employee-profiles/:employeeId',
    component: EmployeeDetailComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'employee-profiles',
    component: EmployeeProfilesComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'visa-status',
    component: VisaStatusManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'hiring',
    component: HiringManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'housing',
    component: HousingManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'onboarding/application/:applicationId',
    component: ApproveOnboardingComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

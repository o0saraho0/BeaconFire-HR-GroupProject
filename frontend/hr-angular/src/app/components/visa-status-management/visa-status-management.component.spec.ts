import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisaStatusManagementComponent } from './visa-status-management.component';

describe('VisaStatusManagementComponent', () => {
  let component: VisaStatusManagementComponent;
  let fixture: ComponentFixture<VisaStatusManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisaStatusManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisaStatusManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveOnboardingComponent } from './approve-onboarding.component';

describe('ApproveOnboardingComponent', () => {
  let component: ApproveOnboardingComponent;
  let fixture: ComponentFixture<ApproveOnboardingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApproveOnboardingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApproveOnboardingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

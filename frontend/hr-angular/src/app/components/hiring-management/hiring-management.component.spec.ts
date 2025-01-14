import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HiringManagementComponent } from './hiring-management.component';

describe('HiringManagementComponent', () => {
  let component: HiringManagementComponent;
  let fixture: ComponentFixture<HiringManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HiringManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HiringManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

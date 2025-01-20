import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHouseDialogComponent } from './add-house.component';

describe('AddHouseComponent', () => {
  let component: AddHouseDialogComponent;
  let fixture: ComponentFixture<AddHouseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddHouseDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddHouseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

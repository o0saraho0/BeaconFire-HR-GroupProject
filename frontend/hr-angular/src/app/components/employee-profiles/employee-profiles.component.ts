import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employee-profiles',
  templateUrl: './employee-profiles.component.html',
  styleUrls: ['./employee-profiles.component.css'],
})
export class EmployeeProfilesComponent implements OnInit {
  employees = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      ssn: '123-45-6789',
      visa_type: 'H1B',
      cell_phone: '123-456-7890',
      email: 'john.doe@example.com',
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Smith',
      ssn: '987-65-4321',
      visa_type: 'Green Card',
      cell_phone: '987-654-3210',
      email: 'jane.smith@example.com',
    },
  ];

  displayedColumns: string[] = ['name', 'ssn', 'visa_type', 'cell_phone', 'email'];

  constructor() {}

  ngOnInit(): void {}
}

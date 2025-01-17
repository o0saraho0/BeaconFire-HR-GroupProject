import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  cards = [
    { title: 'Employee Profiles', link: '/employee-profiles' },
    { title: 'Visa Status', link: '/visa-status' },
    { title: 'Hiring', link: '/hiring' },
    { title: 'Housing', link: '/housing' },
  ];

  constructor(private router: Router) {}

  navigateTo(link: string) {
    this.router.navigate([link]);
  }

  ngOnInit(): void {
  }

}

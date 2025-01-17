import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-in-progress',
  templateUrl: './visa-status-management.component.html',
  styleUrls: ['./visa-status-management.component.css']
})
export class VisaStatusManagementComponent implements OnInit {
  inProgressVisas: any[] = []; // To store in-progress visa data
  searchResults: any[] = []; // To store search results
  isLoading = true; // For loading spinner during fetch
  isSearchLoading = false; // For loading spinner during search
  searchQuery = { first_name: '', last_name: '', preferred_name: '' }; // Query object for search

  constructor() {}

  ngOnInit(): void {
    this.fetchInProgressVisas(); // Fetch in-progress visas on component initialization
    this.searchVisas();
  }

  // Fetch in-progress visas
  async fetchInProgressVisas() {
    try {
      const response = await axios.get('http://localhost:3000/api/visa/in-progress');
      this.inProgressVisas = response.data.Results; // Bind response data
      this.isLoading = false;
    } catch (error) {
      console.error('Error fetching visa applications:', error);
      this.isLoading = false;
    }
  }

  // Perform search based on query
  async searchVisas() {
    this.isSearchLoading = true;

    // Build query string dynamically
    const queryParams = Object.entries(this.searchQuery)
      .filter(([_, value]) => value.trim() !== '') // Exclude empty fields
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = queryParams
      ? `http://localhost:3000/api/visa/search?${queryParams}`
      : `http://localhost:3000/api/visa/search`; // Fetch all if no query

    try {
      const response = await axios.get(url);
      this.searchResults = response.data; // Bind search results
      this.isSearchLoading = false;
    } catch (error) {
      console.error('Error performing search:', error);
      this.searchResults = [];
      this.isSearchLoading = false;
    }
  }

  // Action handlers
  approveDocument(visa: any): void {
    console.log('Approved:', visa.employee_name);
  }

  rejectDocument(visa: any): void {
    console.log('Rejected:', visa.employee_name);
  }

  sendNotification(visa: any): void {
    console.log('Notification sent to:', visa.employee_name);
  }
}

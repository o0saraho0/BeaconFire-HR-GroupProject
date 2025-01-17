import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  // Shared base URL for the backend
  private readonly BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchInProgressVisas(); // Fetch in-progress visas on component initialization
    this.searchVisas();
  }

  // Fetch in-progress visas
  fetchInProgressVisas(): void {
    const url = `${this.BASE_URL}/api/visa/in-progress`;
    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.inProgressVisas = response.Results; // Bind response data
        this.isLoading = false;
        console.log(this.inProgressVisas)
      },
      error: (error) => {
        console.error('Error fetching visa applications:', error);
        this.isLoading = false;
      }
    });
  }

  // Perform search based on query
  searchVisas(): void {
    this.isSearchLoading = true;

    // Build query string dynamically
    const queryParams = Object.entries(this.searchQuery)
      .filter(([_, value]) => value.trim() !== '') // Exclude empty fields
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const url = queryParams
      ? `${this.BASE_URL}/api/visa/search?${queryParams}`
      : `${this.BASE_URL}/api/visa/search`; // Fetch all if no query

    this.http.get<any>(url).subscribe({
      next: (response) => {
        this.searchResults = response; // Bind search results
        this.isSearchLoading = false;
      },
      error: (error) => {
        console.error('Error performing search:', error);
        this.searchResults = [];
        this.isSearchLoading = false;
      }
    });
  }

  // Action handlers
  approveDocument(visa: any): void {
    const payload = {
      user_id: visa.user_id, // Get user_id from visa
      documentType: visa.visa_type, // Get document type from visa
      action: 'approve',
      feedback: '' // Feedback is optional for approve
    };

    this.http.post(`${this.BASE_URL}/api/visa/review`, payload).subscribe({
      next: (response: any) => {
        alert(`Approved successfully: ${response.message}`);
        this.fetchInProgressVisas(); // Refresh the list
      },
      error: (error) => {
        console.error('Error approving document:', error);
        alert('Failed to approve document. Please try again.');
      }
    });
  }


  rejectDocument(visa: any): void {
    const feedback = prompt('Please provide a reason for rejection:');
    if (!feedback) return; // Do nothing if no feedback is provided

    const payload = {
      user_id: visa.user_id,
      documentType: visa.visa_type,
      action: 'reject',
      feedback: feedback
    };

    this.http.post(`${this.BASE_URL}/api/visa/review`, payload).subscribe({
      next: (response: any) => {
        alert(`Rejected successfully: ${response.message}`);
        this.fetchInProgressVisas(); // Refresh the list
      },
      error: (error) => {
        console.error('Error rejecting document:', error);
        alert('Failed to reject document. Please try again.');
      }
    });
  }

  sendNotification(visa: any): void {
    console.log('Notification sent to:', visa.employee_name);
  }

  // Get the document URL based on the stage
getDocumentUrl(visa: any): string | null {
  switch (visa.stage) {
    case 'OPT Receipt':
      return visa.opt_receipt_url || null;
    case 'EAD':
      return visa.opt_ead_url || null;
    case 'I983':
      return visa.i983_url || null;
    case 'I20':
      return visa.i20_url || null;
    default:
      return null;
  }
}


// Open the document in a new browser tab
previewDocument(visa: any): void {
  const url = this.getDocumentUrl(visa);
  if (url) {
    window.open(url, '_blank');
  } else {
    alert('Document is not available for this stage.');
  }
}

downloadDocument(url: string): void {
  window.open(url, '_blank');
}

}


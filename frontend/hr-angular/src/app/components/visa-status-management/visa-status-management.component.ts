import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


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
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  if (!token) {
    alert('No token found. Please log in again.');
    this.isLoading = false; // Stop loading if no token
    return;
  }

  const url = `${this.BASE_URL}/api/visa/in-progress`;

  // Include the Authorization token in the headers
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Add token to the Authorization header
  };

  this.http.get<any>(url, { headers }).subscribe({
    next: (response) => {
      this.inProgressVisas = response.Results; // Bind response data
      this.isLoading = false;
      console.log(this.inProgressVisas); // Log the response for debugging
    },
    error: (error) => {
      console.error('Error fetching visa applications:', error); // Log error details
      this.isLoading = false; // Stop loading in case of an error
    }
  });
}


  // Perform search based on query
searchVisas(): void {
  this.isSearchLoading = true;

  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  if (!token) {
    alert('No token found. Please log in again.');
    this.isSearchLoading = false;
    return;
  }

  // Build query string dynamically
  const queryParams = Object.entries(this.searchQuery)
    .filter(([_, value]) => value.trim() !== '') // Exclude empty fields
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  const url = queryParams
    ? `${this.BASE_URL}/api/visa/search?${queryParams}`
    : `${this.BASE_URL}/api/visa/search`; // Fetch all if no query

  // Include the Authorization token in the headers
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Add token to the Authorization header
  };

  this.http.get<any>(url, { headers }).subscribe({
    next: (response) => {
      this.searchResults = response; // Bind search results
      this.isSearchLoading = false;
      console.log(this.searchResults); // Log search results for debugging
    },
    error: (error) => {
      console.error('Error performing search:', error); // Log error details
      this.searchResults = []; // Reset search results
      this.isSearchLoading = false; // Stop loading spinner
    }
  });
}


 // Action handlers
approveDocument(visa: any): void {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  console.log(token)

  if (!token) {
    alert('Authentication token not found. Please log in again.');
    return;
  }

  const payload = {
    user_ide: visa.user_id, // Get user_id from visa
    documentType: visa.visa_type, // Get document type from visa
    action: 'approve',
    feedback: '', // Feedback is optional for approve
  };

  this.http.post(`${this.BASE_URL}/api/visa/review`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  }).subscribe({
    next: (response: any) => {
      alert(`Approved successfully: ${response.message}`);
      this.fetchInProgressVisas(); // Refresh the list
    },
    error: (error) => {
      console.error('Error approving document:', error);
      alert('Failed to approve document. Please try again.');
    },
  });
}

rejectDocument(visa: any): void {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  console.log(token)

  if (!token) {
    alert('Authentication token not found. Please log in again.');
    return;
  }

  const feedback = prompt('Please provide a reason for rejection:');
  if (!feedback) {
    alert('Rejection reason is required.');
    return;
  }

  const payload = {
    user_ide: visa.user_id,
    documentType: visa.visa_type,
    action: 'reject',
    feedback: feedback, // Reason for rejection
  };

  this.http.post(`${this.BASE_URL}/api/visa/review`, payload, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  }).subscribe({
    next: (response: any) => {
      alert(`Rejected successfully: ${response.message}`);
      this.fetchInProgressVisas(); // Refresh the list
    },
    error: (error) => {
      console.error('Error rejecting document:', error);
      alert('Failed to reject document. Please try again.');
    },
  });
}

sendNotification(visa: any): void {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage

  if (!token) {
    alert('No token found. Please log in again.'); // Handle missing token scenario
    return;
  }

  const payload = {
    emaile: visa.email, // Email address to send the notification
    stage: visa.stage, // Include the stage information in the notification
  };

  const url = `${this.BASE_URL}/api/visa/sendNotification`; // API endpoint for sending notifications

  // Include the Authorization token in the headers
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, // Attach token to the Authorization header
  };

  this.http.post(url, payload, { headers }).subscribe({
    next: (response: any) => {
      alert(`Notification sent successfully to: ${visa.email}`); // Success response
    },
    error: (error) => {
      console.error('Error sending notification:', error); // Log error details for debugging
      alert('Failed to send notification. Please try again.'); // Handle error scenario
    }
  });
}


  // Get the document URL based on the stage
getDocumentUrl(visa: any): string | null {
  switch (visa.stage) {
    case 'OPT Receipt':
      return visa.opt_receipt_url || null;
    case 'OPT EAD':
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

previewDocuments(url: string): void {
  window.open(url, '_blank');
}

forceDownload(link: any): void {
  const url = link;
  const fileName = "i983.png";

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.blob(); 
    })
    .then((blob) => {
      const blobUrl = window.URL.createObjectURL(blob); 

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);
    })
    .catch((error) => {
      console.error("File download failed:", error);
    });
}

getNextStep(visa: any): string {
  // Dynamically determine what to display based on visa data
  if(visa.status=="Pending"){
    return `${visa.stage} document is waiting for HR approval`
  }

  if(visa.stage=="Complete"){
    return "All documents has been uploaded"
  }

  if(visa.status=="Not Started"){
    return `${visa.stage} document has not been uploaded yet`
  }

  if(visa.status=="Reject"){
    return `${visa.stage} document is rejected and should be uploaded again`
  }
  
  return "Status is not recognized or missing";
}

}


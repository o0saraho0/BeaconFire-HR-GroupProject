import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FacilityReportsService {
  private apiUrl = 'http://localhost:3000/api/reports';

  constructor(private http: HttpClient) {}

  // Fetch all reports for a specific house
  getReportsByHouse(houseId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${houseId}`);
  }

  // Create a new facility report
  createFacilityReport(reportData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, reportData);
  }

  // Update the status of a report
  updateReportStatus(reportId: string, status: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${reportId}`, status);
  }

  // Add a comment to a specific report
  addComment(reportId: string, commentData: { posted_by: string; description: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${reportId}/comments`, commentData);
  }

  // Update a specific comment
  updateComment(reportId: string, commentId: string, commentData: any): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${reportId}/comments/${commentId}`, commentData);
  }

  // Fetch comments for a specific report
  getComments(reportId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${reportId}/comments`);
  }
}

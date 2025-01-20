import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
    fetchFacilityReports,
    updateReportStatus,
    fetchComments,
    addComment,
} from '../../store/facility-reports/facility-reports.actions';
import {
    selectAllFacilityReports,
    selectFacilityReportsLoading,
    selectFacilityReportsError,
    selectCommentsForReport,
} from '../../store/facility-reports/facility-reports.selectors';

@Component({
    selector: 'app-facility-reports',
    templateUrl: './facility-reports.component.html',
    styleUrls: ['./facility-reports.component.css'],
})
export class FacilityReportsComponent implements OnInit {
    reports$: Observable<any[]>; // Observable for all facility reports
    loading$: Observable<boolean>; // Observable for loading state
    error$: Observable<string | null>; // Observable for error messages
    selectedReport: any | null = null; // Holds the currently selected report for viewing comments

    constructor(private store: Store) {
        this.reports$ = this.store.select(selectAllFacilityReports);
        this.loading$ = this.store.select(selectFacilityReportsLoading);
        this.error$ = this.store.select(selectFacilityReportsError);
    }

    ngOnInit(): void {
        const houseId = '678a8681f46e576b70d77c1b'; // Replace with the actual houseId from context
        this.store.dispatch(fetchFacilityReports({ houseId }));
    }

    // Display comments for a selected report
    onViewComments(report: any): void {
        this.selectedReport = report; // Store the selected report
    }

    // Add a comment to a specific report
    onAddComment(reportId: string, commentText: string): void {
        if (!commentText.trim()) {
            return; // Prevent empty comments
        }
        const commentData = { description: commentText, posted_by: 'hr' };
        console.log('Dispatching addComment:', { reportId, commentData }); // Debug log
        this.store.dispatch(addComment({ reportId, comment: commentData }));
    }

    // Update the status of a specific report
    onUpdateReportStatus(reportId: string, newStatus: string): void {
        this.store.dispatch(updateReportStatus({ reportId, status: newStatus }));
    }

    // Close the comments section
    closeComments(): void {
        this.selectedReport = null; // Reset the selected report
    }
}

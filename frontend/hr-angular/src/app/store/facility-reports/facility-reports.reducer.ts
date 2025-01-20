import { createReducer, on } from '@ngrx/store';
import * as FacilityReportsActions from './facility-reports.actions';

export interface FacilityReportsState {
    reports: any[]; // Array of facility reports
    loading: boolean; // Loading indicator
    error: string | null; // Error message, if any
    comments: { [reportId: string]: any[] }; // Comments stored by report ID
}

export const initialState: FacilityReportsState = {
    reports: [],
    loading: false,
    error: null,
    comments: {}
};

export const facilityReportsReducer = createReducer(
    initialState,
    on(FacilityReportsActions.fetchFacilityReports, (state) => ({
        ...state,
        loading: true,
        error: null,
    })),
    on(FacilityReportsActions.fetchFacilityReportsSuccess, (state, { reports }) => ({
        ...state,
        loading: false,
        reports,
    })),
    on(FacilityReportsActions.fetchFacilityReportsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error,
    })),
    on(FacilityReportsActions.fetchCommentsSuccess, (state, { reportId, comments }) => ({
        ...state,
        comments: {
            ...state.comments,
            [reportId]: comments, // Store comments by report ID
        },
    })),
    on(FacilityReportsActions.fetchCommentsFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false,
    })),
    on(FacilityReportsActions.addCommentSuccess, (state, { reportId, comment }) => ({
        ...state,
        reports: state.reports.map((report) =>
            report._id === reportId
                ? { ...report, comments: [...report.comments, comment] }
                : report
        ),
    })),
    on(FacilityReportsActions.addCommentFailure, (state, { error }) => ({
        ...state,
        error,
    }))
);

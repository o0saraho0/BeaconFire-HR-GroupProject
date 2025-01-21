import { createAction, props } from '@ngrx/store';

export const fetchFacilityReports = createAction(
    '[Facility Reports] Fetch Facility Reports',
    props<{ houseId: string }>() // Include houseId as part of the action payload
);

export const fetchFacilityReportsSuccess = createAction(
    '[Facility Reports] Fetch Facility Reports Success',
    props<{ reports: any[] }>() // Ensure reports is properly typed
);

export const fetchFacilityReportsFailure = createAction(
    '[Facility Reports] Fetch Facility Reports Failure',
    props<{ error: string }>()
);

export const fetchComments = createAction(
    '[Facility Reports] Fetch Comments',
    props<{ reportId: string }>()
);

export const addComment = createAction(
    '[Facility Reports] Add Comment',
    props<{ reportId: string; comment: any }>()
);

export const addCommentSuccess = createAction(
    '[Facility Reports] Add Comment Success',
    props<{ reportId: string; comment: any }>()
);

// Action dispatched when adding a comment fails
export const addCommentFailure = createAction(
    '[Facility Reports] Add Comment Failure',
    props<{ error: string }>()
);

export const updateReportStatus = createAction(
    '[Facility Reports] Update Report Status',
    props<{ reportId: string; status: string }>()
);

export const fetchCommentsSuccess = createAction(
    '[Facility Reports] Fetch Comments Success',
    props<{ reportId: string; comments: any[] }>() // Pass the report ID and comments
);

export const fetchCommentsFailure = createAction(
    '[Facility Reports] Fetch Comments Failure',
    props<{ error: string }>() // Error message
);
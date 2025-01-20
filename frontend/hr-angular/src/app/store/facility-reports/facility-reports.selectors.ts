import { createSelector, createFeatureSelector } from '@ngrx/store';
import { FacilityReportsState } from './facility-reports.reducer';

export const selectFacilityReportsState = createFeatureSelector<FacilityReportsState>('facilityReports');

export const selectAllFacilityReports = createSelector(
    selectFacilityReportsState,
    (state) => state.reports
);

export const selectFacilityReportsLoading = createSelector(
    selectFacilityReportsState,
    (state) => state.loading
);

export const selectFacilityReportsError = createSelector(
    selectFacilityReportsState,
    (state) => state.error
);

export const selectCommentsForReport = (reportId: string) =>
    createSelector(
        selectFacilityReportsState,
        (state) => state.comments[reportId] || [] // Assuming comments are stored by reportId
    );

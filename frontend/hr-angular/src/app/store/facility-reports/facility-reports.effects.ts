import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import * as FacilityReportsActions from './facility-reports.actions';
import { FacilityReportsService } from '../../services/facility-reports.service';

@Injectable()
export class FacilityReportsEffects {
    constructor(private actions$: Actions, private facilityReportsService: FacilityReportsService) {}

    // Effect to fetch facility reports by houseId
    fetchFacilityReports$ = createEffect(() =>
        this.actions$.pipe(
        ofType(FacilityReportsActions.fetchFacilityReports),
        mergeMap((action) =>
            this.facilityReportsService.getReportsByHouse(action.houseId).pipe(
            map((reports: any[]) =>
                FacilityReportsActions.fetchFacilityReportsSuccess({ reports })
            ),
            catchError((error) =>
                of(
                FacilityReportsActions.fetchFacilityReportsFailure({
                    error: error.message,
                })
                )
            )
            )
        )
        )
    );

    addComment$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FacilityReportsActions.addComment),
            mergeMap((action) =>
                this.facilityReportsService.addComment(action.reportId, action.comment).pipe(
                    map((comment) =>
                        FacilityReportsActions.addCommentSuccess({ reportId: action.reportId, comment })
                    ),
                    catchError((error) =>
                        of(FacilityReportsActions.addCommentFailure({ error: error.message }))
                    )
                )
            )
        )
    );
    
}

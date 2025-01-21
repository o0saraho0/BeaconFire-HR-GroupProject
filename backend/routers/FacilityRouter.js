import express from 'express';
import { createFacilityReport, getReportsByHouse, updateReportStatus, addComment, updateComment, getComments } from '../controllers/FacilityReportController.js';
import { jwtValidation, authenticatedHR, authenticatedEmployee } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', jwtValidation, authenticatedEmployee, createFacilityReport);
router.get('/:houseId', jwtValidation, getReportsByHouse); // Make sure to change to authenticatedHR
router.patch('/:reportId', jwtValidation, authenticatedEmployee, updateReportStatus);

// comment routes
router.post('/:reportId/comments', jwtValidation, addComment);
router.patch('/:reportId/comments/:commentId', jwtValidation, updateComment);
router.get('/:reportId/comments', jwtValidation, getComments);

export default router;
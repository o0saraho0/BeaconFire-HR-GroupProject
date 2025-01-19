import express from 'express';
import { createFacilityReport, getReportsByHouse, updateReportStatus, addComment, updateComment, getComments } from '../controllers/FacilityReportController.js';
import { jwtValidation, authenticatedHR, authenticatedEmployee } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', jwtValidation, authenticatedEmployee, createFacilityReport);
router.get('/:houseId', jwtValidation, authenticatedEmployee, getReportsByHouse); // Make sure to change to authenticatedHR
router.patch('/:reportId', jwtValidation, authenticatedEmployee, updateReportStatus);

// comment routes
router.post('/:reportId/comments', jwtValidation, authenticatedEmployee, addComment);
router.patch('/:reportId/comments/:commentId', jwtValidation, updateComment);
router.get('/:reportId/comments', jwtValidation, authenticatedEmployee, getComments);

export default router;
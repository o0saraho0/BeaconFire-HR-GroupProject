import express from 'express';
import { createFacilityReport, getReportsByHouse, updateReportStatus } from '../controllers/FacilityReportController.js';
import { jwtValidation, authenticatedHR } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', jwtValidation, authenticatedHR, createFacilityReport);
router.get('/:houseId', jwtValidation, authenticatedHR, getReportsByHouse);
router.patch('/:reportId', jwtValidation, authenticatedHR, updateReportStatus);

export default router;
import express from 'express';
import { createFacilityReport, getReportsByHouse, updateReportStatus } from '../controllers/FacilityReportController.js';
import { jwtValidation } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', jwtValidation, createFacilityReport);
router.get('/:houseId', jwtValidation, getReportsByHouse);
router.patch('/:id', jwtValidation, updateReportStatus);

export default router;
import express from 'express';
import { createFacilityReport, getReportsByHouse, updateReportStatus } from '../controllers/FacilityReportController.js';
import authenticateUser from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/', authenticateUser, createFacilityReport);
router.get('/:houseId', authenticateUser, getReportsByHouse);
router.patch('/:id', authenticateUser, updateReportStatus);

export default router;
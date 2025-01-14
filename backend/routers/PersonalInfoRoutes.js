import { Router } from 'express';
import { jwtValidation } from '../middlewares/AuthMiddleware.js';
import { getEmployeeProfile, updateProfile } from '../controllers/EmployeeProfileController.js';

const personalInfoRouter = Router();
personalInfoRouter.get('/', jwtValidation, getEmployeeProfile);
personalInfoRouter.post('/', jwtValidation, updateProfile);

export { personalInfoRouter };
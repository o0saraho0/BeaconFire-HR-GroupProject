import { Router } from 'express';
import { getEmployeeProfile, updateProfile } from '../controllers/EmployeeProfileController.js';
import { jwtValidation, authenticatedEmployee } from '../middlewares/AuthMiddleware.js';


const PersonalInfoRouter = Router();
PersonalInfoRouter.get('/', jwtValidation, authenticatedEmployee, getEmployeeProfile);
PersonalInfoRouter.post('/', jwtValidation, authenticatedEmployee, updateProfile);

export default PersonalInfoRouter;

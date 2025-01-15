import { Router } from 'express';
import { getApplicationStatus, postOnboarding } from '../controllers/ApplicationController.js';
import { jwtValidation } from '../middlewares/AuthMiddleware.js';

const OnboardingRouter = Router();
OnboardingRouter.get('/status', jwtValidation, getApplicationStatus);
OnboardingRouter.post('/', jwtValidation, postOnboarding);

export default OnboardingRouter;
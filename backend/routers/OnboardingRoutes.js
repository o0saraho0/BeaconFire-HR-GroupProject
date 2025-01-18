import { Router } from 'express';
import { getApplicationStatus, postOnboarding, getAllOnboardingApplications } from '../controllers/ApplicationController.js';
import { authenticatedHR, jwtValidation } from '../middlewares/AuthMiddleware.js';

const OnboardingRouter = Router();
OnboardingRouter.get('/status', jwtValidation, getApplicationStatus);
OnboardingRouter.post('/', jwtValidation, postOnboarding);

OnboardingRouter.get('/applications', jwtValidation, authenticatedHR, getAllOnboardingApplications)

export default OnboardingRouter;
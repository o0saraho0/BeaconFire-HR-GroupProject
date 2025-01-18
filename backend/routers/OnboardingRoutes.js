import { Router } from 'express';
import { getApplicationStatus, postOnboarding, getAllOnboardingApplications, getApplicationDetailUsingApplicationId } from '../controllers/ApplicationController.js';
import { authenticatedHR, jwtValidation } from '../middlewares/AuthMiddleware.js';

const OnboardingRouter = Router();
OnboardingRouter.get('/status', jwtValidation, getApplicationStatus);
OnboardingRouter.post('/', jwtValidation, postOnboarding);

OnboardingRouter.get('/applications', jwtValidation, authenticatedHR, getAllOnboardingApplications)
OnboardingRouter.get('/application/:applicationId', jwtValidation, authenticatedHR, getApplicationDetailUsingApplicationId)

export default OnboardingRouter;
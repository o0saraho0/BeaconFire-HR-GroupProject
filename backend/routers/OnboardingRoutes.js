import { Router } from 'express';
import { getApplicationStatus, postOnboarding } from '../controllers/ApplicationController.js';
import { jwtValidation } from '../middlewares/AuthMiddleware.js';

const onboardingRouter = Router();
onboardingRouter.get('/status', jwtValidation, getApplicationStatus);
onboardingRouter.post('/', jwtValidation, postOnboarding);

export { onboardingRouter };
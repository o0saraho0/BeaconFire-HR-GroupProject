import { Router } from 'express';
import { getApplicationStatus } from '../controllers/UserController';
import jwtValidation from '../middlewares/AuthMiddleware';

const onboardingRouter = Router();
onboardingRouter.get('/status', jwtValidation, getApplicationStatus);
onboardingRouter.post('/', postOnboarding);
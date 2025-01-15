import express from 'express';
import { generatePresignedUrl, singleUpload } from '../middlewares/AwsS3Middleware.js';
import { uploadProfilePicture, uploadDriverLicense, uploadOptReceipt } from '../controllers/UploadController.js';
import { jwtValidation, authenticatedEmployee } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/profile-picture', jwtValidation, authenticatedEmployee, singleUpload, uploadProfilePicture);
router.post('/driver-license', jwtValidation, authenticatedEmployee, singleUpload, uploadDriverLicense);
router.post('/opt-receipt', jwtValidation, authenticatedEmployee, singleUpload, uploadOptReceipt);
router.get('/presigned-url', jwtValidation, authenticatedEmployee, generatePresignedUrl)

export default router;
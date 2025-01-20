import express from 'express';
import { generatePresignedUrl, singleUpload } from '../middlewares/AwsS3Middleware.js';
import { uploadProfilePicture, uploadDriverLicense, uploadOptReceipt, getPreSignedUrl } from '../controllers/UploadController.js';
import { jwtValidation, authenticatedEmployee } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/profile-picture', jwtValidation, singleUpload, uploadProfilePicture);
router.post('/driver-license', jwtValidation, singleUpload, uploadDriverLicense);
router.post('/opt-receipt', jwtValidation, singleUpload, uploadOptReceipt);
router.get('/presigned-url', jwtValidation, getPreSignedUrl);

export default router;   
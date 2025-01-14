import express from 'express';
import { generatePresignedUrl, singleUpload } from '../middlewares/AwsS3Middleware.js';
import { uploadProfilePicture, uploadDriverLicense, uploadOptReceipt } from '../controllers/UploadController.js';

const router = express.Router();

router.post('/profile-picture', singleUpload, uploadProfilePicture);
router.post('/driver-license', singleUpload, uploadDriverLicense);
router.post('/opt-receipt', singleUpload, uploadOptReceipt);
router.get('/presignedUrl', generatePresignedUrl,)

export default router;
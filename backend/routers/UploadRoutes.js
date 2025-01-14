import express from 'express';
import { singleUpload } from '../middlewares/AwsS3Middleware.js';
import { uploadProfilePicture, uploadDriverLicense, uploadOptReceipt } from '../controllers/UploadController.js';

const router = express.Router();

router.post('/profile-picture', singleUpload, uploadProfilePicture);
router.post('/driver-license', singleUpload, uploadDriverLicense);
router.post('/opt-receipt', singleUpload, uploadOptReceipt);

export default router;
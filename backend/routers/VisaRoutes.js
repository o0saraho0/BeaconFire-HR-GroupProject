import express from "express";
import {
    uploadVisaDocument,
    getVisaDetails,
    reviewDocument,
    getInProgressVisas,
    searchEmployees,
    sendNotification
} from "../controllers/VisaController.js";
import { singleUpload } from "../middlewares/AwsS3Middleware.js";
import { jwtValidation, authenticatedHR, authenticatedEmployee } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// // Route to upload a document
router.post("/upload", jwtValidation, authenticatedEmployee, singleUpload, uploadVisaDocument);
router.post("/review", jwtValidation, reviewDocument);
router.get("/in-progress",jwtValidation, getInProgressVisas);
router.get("/search",jwtValidation, searchEmployees);
router.post("/sendNotification",jwtValidation,sendNotification)
router.get("/:user_id", jwtValidation,authenticatedEmployee, getVisaDetails);

export default router;

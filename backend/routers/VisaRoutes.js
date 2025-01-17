import express from "express";
import {
    uploadVisaDocument,
    getVisaDetails,
    reviewDocument,
    getInProgressVisas,
    searchEmployees,
} from "../controllers/VisaController.js";
import { singleUpload } from "../middlewares/AwsS3Middleware.js";
import { jwtValidation, authenticatedHR, authenticatedEmployee } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

// // Route to upload a document
// router.post("/upload", jwtValidation, authenticatedEmployee, singleUpload, uploadVisaDocument);
router.post("/upload",singleUpload, uploadVisaDocument);

// Route to approve or reject a document (HR action)
// router.post("/review", jwtValidation, authenticatedHR, reviewDocument);
router.post("/review", reviewDocument);

// Route to get in-progress visas
// router.get("/in-progress", jwtValidation, authenticatedHR, getInProgressVisas);
router.get("/in-progress", getInProgressVisas);

// Route to get all visa-status employees (with search functionality)
router.get("/search", searchEmployees);

// Route to get visa details for a user
// router.get("/:user_id", jwtValidation, authenticatedHR, getVisaDetails);
router.get("/:user_id", getVisaDetails);

export default router;

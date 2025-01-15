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

// Route to upload a document
router.post("/upload", jwtValidation, authenticatedEmployee, singleUpload, uploadVisaDocument);

// Route to approve or reject a document (HR action)
router.post("/review", jwtValidation, authenticatedHR, reviewDocument);

// Route to get in-progress visas
router.get("/in-progress", jwtValidation, authenticatedHR, getInProgressVisas);

// Route to get all visa-status employees (with search functionality)
<<<<<<< HEAD
router.get("/search", searchEmployees);
=======
router.get("/all", jwtValidation, authenticatedHR, getAllVisaStatusEmployees);
>>>>>>> 46c9f84d674d74c7af48bf560f0fc69b9fcb0258

// Route to get visa details for a user
router.get("/:user_id", jwtValidation, authenticatedHR, getVisaDetails);

export default router;

import express from "express";
import {
  uploadVisaDocument,
  getVisaDetails,
  reviewDocument,
  getInProgressVisas,
  getAllVisaStatusEmployees,
} from "../controllers/VisaController.js";
import { singleUpload } from "../middlewares/AwsS3Middleware.js";

const router = express.Router();

// Route to upload a document
router.post("/upload", singleUpload, uploadVisaDocument);

// Route to approve or reject a document (HR action)
router.post("/review", reviewDocument);

// Route to get in-progress visas
router.get("/in_progress", getInProgressVisas);

// Route to get all visa-status employees (with search functionality)
router.get("/all", getAllVisaStatusEmployees);

// Route to get visa details for a user
router.get("/:user_id", getVisaDetails);

export default router;

import express from "express";
import { generateToken, validateToken } from "../controllers/RegistrationController.js";

const router = express.Router();

/**
 * POST /api/registration/generate-token
 * Generate a registration token and send it via email
 */
router.post("/generate-token", generateToken);

/**
 * POST /api/registration/validate-token
 * Validate a registration token
 */
router.post("/validate-token", validateToken);

export default router;

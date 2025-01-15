import express from "express";
import { generateAndSendRegisterToken, validateRegisterToken } from "../controllers/RegistrationController.js";

const router = express.Router();

/**
 * POST /api/registration/generate-token
 * Generate a registration token and send it via email
 */
router.post("/generate-and-send-email", generateAndSendRegisterToken);

/**
 * POST /api/registration/validate-token
 * Validate a registration token
 */
router.post("/validate-register-token", validateRegisterToken);

export default router;

import express from "express";
<<<<<<< HEAD
import { validateToken, registerAndSendEmail } from "../controllers/RegistrationController.js";

const router = express.Router();

// Register and send email
router.post("/register", registerAndSendEmail);
// Validate token route
router.get("/validate/:token", validateToken);
=======
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
>>>>>>> 46c9f84d674d74c7af48bf560f0fc69b9fcb0258

export default router;

import express from "express";
import { validateRegisterToken, generateAndSendRegisterToken, getAllRegistrations } from "../controllers/RegistrationController.js";

const router = express.Router();

// Register and send email
router.post("/generate-and-send-email", generateAndSendRegisterToken);
// Validate token route
router.post("/validate-register-token", validateRegisterToken);
// New API to fetch all registrations
router.get("/all", getAllRegistrations);

export default router;

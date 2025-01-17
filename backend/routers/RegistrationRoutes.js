import express from "express";
import { validateToken, generateAndSendRegisterToken, getAllRegistrations } from "../controllers/RegistrationController.js";

const router = express.Router();

// Register and send email
router.post("/register", generateAndSendRegisterToken);
// Validate token route
router.get("/validate/:token", validateToken);
// New API to fetch all registrations
router.get("/all", getAllRegistrations);

export default router;

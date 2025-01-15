import express from "express";
import { validateToken, registerAndSendEmail } from "../controllers/registrationController.js";

const router = express.Router();

// Register and send email
router.post("/register", registerAndSendEmail);
// Validate token route
router.get("/validate/:token", validateToken);

export default router;

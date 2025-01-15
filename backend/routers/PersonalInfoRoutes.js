import { Router } from "express";
import { jwtValidation } from "../middlewares/AuthMiddleware.js";
import {
  getEmployeeProfile,
  updateProfile,
} from "../controllers/EmployeeProfileController.js";

const PersonalInfoRouter = Router();
PersonalInfoRouter.get("/", jwtValidation, getEmployeeProfile);
PersonalInfoRouter.post("/", updateProfile);

export default PersonalInfoRouter;

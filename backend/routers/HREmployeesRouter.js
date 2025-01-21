import express from "express";
import { jwtValidation,authenticatedHR } from "../middlewares/AuthMiddleware.js";
import {
  getAllEmployees,
  getEmployeeById,
} from "../controllers/HREmployeeController.js";

const HREmployessRouter = express.Router();

// link: /api/hr/employees
HREmployessRouter.get("/:employeeId", jwtValidation, authenticatedHR,getEmployeeById);
HREmployessRouter.get("/", jwtValidation,authenticatedHR, getAllEmployees);

export default HREmployessRouter;

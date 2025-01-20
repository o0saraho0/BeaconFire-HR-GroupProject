import express from "express";
import { jwtValidation } from "../middlewares/AuthMiddleware.js";
import {
  getAllEmployees,
  getEmployeeById,
} from "../controllers/HREmployeeController.js";

const HREmployessRouter = express.Router();

// link: /api/hr/employees
HREmployessRouter.get("/:employeeId", jwtValidation, getEmployeeById);
HREmployessRouter.get("/", jwtValidation, getAllEmployees);

export default HREmployessRouter;

import express from "express";
import { jwtValidation } from "../middlewares/AuthMiddleware.js";
import {
  getAllEmployees,
  getEmployeeById,
} from "../controllers/HREmployeeController.js";

const HREmployessRouter = express.Router();

// link: /api/hr/employees
HREmployessRouter.get("/", getAllEmployees);
HREmployessRouter.get("/:employeeId", jwtValidation, getEmployeeById);

export default HREmployessRouter;

import express from "express";
import { jwtValidation } from "../middlewares/AuthMiddleware.js";
import {
  getAllEmployees,
  getEmployeeById,
} from "../controllers/HREmployeeController.js";

const HREmployessRouter = express.Router();

// link: /api/hr/employees
HREmployessRouter.get("/:employeeId", getEmployeeById);
HREmployessRouter.get("/", getAllEmployees);

export default HREmployessRouter;

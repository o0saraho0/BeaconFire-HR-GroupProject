import express from "express";
import morgan from "morgan";
import { onboardingRouter } from "./routers/OnboardingRoutes.js";
import cors from 'cors';
import UserRouter from './routers/UserRoutes.js'
import { personalInfoRouter } from "./routers/PersonalInfoRoutes.js";
import VisaRouter from "./routers/VisaRoutes.js";

const app = express();
app.use(morgan(":method :url :status :response-time ms")); // enable morgan for logging

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET, POST, DELETE, PATCH',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", UserRouter);
app.use("/api/onboarding", onboardingRouter);
app.use("/api/personalinfo", personalInfoRouter);
app.use("/api/visa", VisaRouter);

app.all("*", (_req, res) => {
  return res.status(404).json({ message: "Page Not Found" });
});


export default app;

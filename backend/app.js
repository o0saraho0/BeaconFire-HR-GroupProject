import express from "express";
import morgan from "morgan";
import cors from 'cors';

import RegistrationRouter from "./routers/RegistrationRoutes.js"
import UserRouter from './routers/UserRoutes.js'
import OnboardingRouter from "./routers/OnboardingRoutes.js";
import PersonalInfoRouter from "./routers/PersonalInfoRoutes.js";
import VisaRouter from "./routers/VisaRoutes.js";
import UploadRouter from "./routers/UploadRoutes.js";
import HouseRouter from "./routers/HouseRouter.js";
import FacilityReportRouter from "./routers/FacilityRouter.js";


const app = express();
app.use(morgan(":method :url :status :response-time ms")); // enable morgan for logging

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:4200'],
  methods: 'GET, POST, DELETE, PATCH, PUT',
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Api routes
app.use("/api/registration", RegistrationRouter)
app.use("/api/user", UserRouter); // more like auth routes...
app.use("/api/onboarding", OnboardingRouter);
app.use("/api/personalinfo", PersonalInfoRouter);
app.use("/api/visa", VisaRouter);
app.use("/api/upload", UploadRouter)
app.use("/api/houses", HouseRouter);
app.use("/api/reports", FacilityReportRouter);

app.all("*", (_req, res) => {
  return res.status(404).json({ message: "Page Not Found" });
});

export default app;

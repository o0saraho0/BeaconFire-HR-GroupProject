import express from "express";
import morgan from "morgan";
import { onboardingRouter } from "./routers/OnboardingRoutes.js";
import cors from 'cors';

const app = express();
app.use(morgan(":method :url :status :response-time ms")); // enable morgan for logging


const corsOptions = {
  origin: 'http://localhost:5173',
  methods: 'GET, POST, DELETE, PATCH',
};

app.use(cors(corsOptions));
app.all("*", (_req, res) => {
  return res.status(404).json({ message: "Page Not Found" });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/onboarding', onboardingRouter);

export default app;

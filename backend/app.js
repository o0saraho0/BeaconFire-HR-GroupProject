import express from "express";
import morgan from "morgan";
import { onboardingRouter } from './routers/OnboardingRoutes';

const app = express();
app.use(morgan(":method :url :status :response-time ms")); // enable morgan for logging

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/onboarding', onboardingRouter);

app.all("*", (_req, res) => {
  return res.status(404).json({ message: "Page Not Found" });
});

export default app;

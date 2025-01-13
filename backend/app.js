import express from "express";
import morgan from "morgan";
import registrationRoutes from "./routers/RegistrationRoutes.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import visaRoutes from "./routers/VisaRoutes.js";

dotenv.config(); // Load environment variables

const app = express();
app.use(morgan(":method :url :status :response-time ms")); // Enable morgan for logging

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((error) => console.error("MongoDB connection error:", error));

app.use("/api/registration", registrationRoutes);
app.use("/api/visa", visaRoutes);

app.all("*", (_req, res) => {
  return res.status(404).json({ message: "Page Not Found" });
});

export default app;

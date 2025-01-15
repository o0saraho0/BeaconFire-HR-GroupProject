import express from "express";
import morgan from "morgan";
import UserRouter from './routers/UserRoutes.js';

const app = express();
app.use(morgan(":method :url :status :response-time ms")); // enable morgan for logging

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Api routes
app.use("/api/user", UserRouter);

app.get("/", (_req, res) => {
  res.status(200).json({ message: "Welcome" });
});

app.all("*", (_req, res) => {
  return res.status(404).json({ message: "Page Not Found" });
});

export default app;

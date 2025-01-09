import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 3000;

mongoose.connect(MONGO_URI);

mongoose.connection.once("open", () => {
  app.listen(PORT, () => {
    console.log("HR Group project server running at port " + PORT);
  });
});

import mongoose from "mongoose";

const registration_schema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  status: {
    type: String,
    enum: ["Not Started", "Pending", "Rejected", "Approved"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + 3 * 60 * 60 * 1000),
  },
});

export default mongoose.model("Registration", registration_schema);

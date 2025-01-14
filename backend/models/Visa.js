import mongoose from "mongoose";

const visa_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  is_opt: { type: Boolean, required: true },
  stage: {
    type: String,
    enum: ["OPT Receipt", "EAD", "I983", "I20", "Complete"],
    required: true,
  },
  status: {
    type: String,
    enum: ["Not Started", "Pending", "Reject"],
    required: true,
  },
  opt_receipt_url: { type: String },
  opt_ead_url: { type: String },
  i983_url: { type: String },
  i20_url: { type: String },
  message: { type: String },
});

export default mongoose.model("Visa", visa_schema, "visas"); // Explicitly set collection name


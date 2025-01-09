import mongoose from "mongoose";

const facility_report_schema = new mongoose.Schema({
  house_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "house",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  status: {
    type: String,
    enum: ["Open", "In Progress", "Closed"],
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  comments: [
    {
      comment_id: { type: mongoose.Schema.Types.ObjectId },
      posted_by: { type: String, enum: ["employee", "hr"] },
      description: { type: String },
      updated_at: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model("FacilityReport", facility_report_schema);

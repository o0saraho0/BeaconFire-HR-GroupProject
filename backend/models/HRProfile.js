import mongoose from "mongoose";

const hr_profile_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
});

export default mongoose.model("HRProfile", hr_profile_schema);

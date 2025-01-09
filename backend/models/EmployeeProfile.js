import mongoose from "mongoose";

const employee_profile_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  middle_name: { type: String },
  preferred_name: { type: String },
  current_address: {
    building: { type: String },
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
  },
  cell_phone: { type: String, required: true },
  work_phone: { type: String },
  car_make: { type: String },
  car_model: { type: String },
  car_color: { type: String },
  ssn: { type: Date, required: true },
  dob: { type: Date, required: true },
  gender: {
    type: String,
    enum: ["Male", "Female", "I do not wish to answer"],
  },
  visa_type: {
    type: String,
    enum: ["Green Card", "Citizen", "H1B Category", "F1 Category", "Other"],
    required: true,
  },
  visa_start_date: { type: Date },
  visa_end_date: { type: Date },
  driver_licence_number: { type: String },
  driver_license_expire_date: { type: Date },
  reference: {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    middle_name: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    relationship: { type: String, required: true },
  },
  emergency_contacts: [
    {
      first_name: { type: String, required: true },
      last_name: { type: String, required: true },
      middle_name: { type: String },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      relationship: { type: String, required: true },
    },
  ],
  profile_picture_url: { type: String },
  driver_licence_url: { type: String },
  work_auth_url: { type: String },
  additional_url: { type: String },
});

export default mongoose.model("EmployeeProfile", employee_profile_schema);

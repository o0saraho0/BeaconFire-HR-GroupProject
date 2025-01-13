import mongoose from "mongoose";

const house_schema = new mongoose.Schema({
  tenants: [
    { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  ],
  address: {
    building: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String, required: true },
  },
  landlord: {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
  },
  facilities: {
    beds: { type: Number, required: true },
    mattresses: { type: Number, required: true },
    tables: { type: Number, required: true },
    chairs: { type: Number, required: true },
  }
});

export default mongoose.model("House", house_schema);

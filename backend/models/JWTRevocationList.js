import mongoose from "mongoose";

const revocation_schema = new mongoose.Schema({
    token: { type: String, required: true, unique: true },
});

export default mongoose.model("JWTRevocationList", revocation_schema);
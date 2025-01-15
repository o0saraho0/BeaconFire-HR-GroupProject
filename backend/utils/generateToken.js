import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const payload = {
    user_id: "mockUserId",
    username: "mockUser",
    email: "mockuser@example.com",
};

const token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });

console.log("Generated Token:", token);
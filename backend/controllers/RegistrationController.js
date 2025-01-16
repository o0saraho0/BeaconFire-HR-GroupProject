import crypto from "crypto";
import nodemailer from "nodemailer";
import Registration from "../models/Registration.js";

/**
 * Generate a registration token and send it to the user's email
 */
export const generateAndSendRegisterToken = async (req, res) => {
    try {
        const { email, first_name, last_name } = req.body;

        // Check if the email already exists
        const existingRecord = await Registration.findOne({ email, status: "Unused" });
        if (existingRecord) {
            return res.status(400).json({ error: "A valid token already exists for this email." });
        }

        // Generate a unique token
        const token = crypto.randomBytes(16).toString("hex");
        const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // Token expires in 3 hours

        // Save token in the database

        const registration_link = `http://localhost:5173/register/${token}`
        // Send token to the user's email
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Registration Token",
            text: `Your registration token is: ${token}. Open this link ${registration_link} to register your username and password. It will expire in 3 hours.`,
        };

        await transporter.sendMail(mailOptions);

        const newRecord = await Registration.create({ email, first_name, last_name, status: "Unused", token, registration_link, expires_at: expiresAt });

        res.status(200).json({ message: "Token generated and sent to email.", data: newRecord });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * Validate a registration token
 */
export const validateRegisterToken = async (req, res) => {
    try {
        const { token } = req.body;

        // Check if the token exists and is unused
        const record = await Registration.findOne({ token, status: "Unused" });
        if (!record) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        // Check if the token has expired
        if (new Date() > record.expires_at) {
            record.status = "Expired";
            await record.save();
            return res.status(400).json({ error: "Token has expired." });
        }

        // Mark token as used
        record.status = "Used";
        await record.save();

        res.status(200).json({ message: "Token validated successfully.", email: record.email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

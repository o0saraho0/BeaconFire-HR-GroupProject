import jwt from "jsonwebtoken";
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
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "3h" });
        const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000); // Token expires in 3 hours

        // Save token in the database

        const registration_link = `http://localhost:5173/register/${token}`
        // Send token to the user's email
        const transporter = nodemailer.createTransport({
            service: "Gmail", // here is gmail
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Complete Your Registration",
            html: `
            <p>Hello ${first_name},</p>
            <p>Please click the link below to complete your registration:</p>
            <a href="${registration_link}">Complete Registration</a>
            <p>This link will expire in 3 hours.</p>
        `,
        };

        await transporter.sendMail(mailOptions);

        const newRecord = await Registration.create({ email, first_name, last_name, status: "Unused", token, registration_link, expires_at: expiresAt });

        res.status(200).json({ message: "Registration email sent!", newRecord });
    } catch (error) {
        res.status(500).json({ error: "Error registering and sending email: " + error.message });
    }
};

export const validateToken = async (req, res) => {
    const { token } = req.params;

    try {
        // Decode and verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { email } = decoded;

        // Find the registration record in the database
        const registration = await Registration.findOne({ email, token });

        if (!registration || registration.expires_at < Date.now()) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Mark token as used
        registration.status = "Used";
        await registration.save();

        res.status(200).json({
            message: "Token validated successfully",
            email: registration.email,
            first_name: registration.first_name,
            last_name: registration.last_name,
        });
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
};

export const getAllRegistrations = async (req, res) => {
    try {
        const registrations = await Registration.find({});
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ error: "Error fetching registrations: " + error.message });
    }
}
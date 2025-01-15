import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import Registration from "../models/Registration.js";

/**
 * Generate a registration token and send it to the user's email
 */
const BASE_URL = "http://your-frontend-url.com/register"; // replace this with registration page url

export const registerAndSendEmail = async (req, res) => {
    const { email, first_name, last_name } = req.body;

    try {
        // generate token based on email
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "3h" });
        const registrationLink = `${BASE_URL}/${token}`;

        // save onto mangodb
        const registration = new Registration({
        email,
        first_name,
        last_name,
        token,
        registration_link: registrationLink,
        status: "Not Started",
        });

        await registration.save();

        // configure of email sending service
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
            <a href="${registrationLink}">Complete Registration</a>
            <p>This link will expire in 3 hours.</p>
        `,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Registration email sent!", registrationLink });
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
    
        res.status(200).json({
            message: "Token is valid",
            email: registration.email,
            first_name: registration.first_name,
            last_name: registration.last_name,
        });
        } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
        }
};
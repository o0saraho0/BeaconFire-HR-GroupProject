import Visa from "../models/Visa.js";
import User from "../models/User.js";
import EmployeeProfile from "../models/EmployeeProfile.js";
import { uploadFileToS3 } from "../middlewares/AwsS3Middleware.js"; // Import the file upload function
import { generatePresignedUrl } from "../middlewares/AwsS3Middleware.js";
import mongoose from "mongoose";
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

//Document Uploading API
export const uploadVisaDocument = async (req, res) => {
    const { user_id, documentType } = req.body;

    // Check if file is uploaded
    if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
    }

    try {
        // Convert user_id to ObjectId using `new`
        const objectId = new mongoose.Types.ObjectId(user_id);

        // Find the visa record by user_id
        const visa = await Visa.findOne({ user_id: objectId });

        // Fetch and log all visa records for debugging purposes
        const allVisas = await Visa.find(); // Fetch all records
        console.log("All Visa Records:", allVisas);

        if (!visa) {
        return res.status(404).json({ message: "Visa record not found" });
        }

        // Generate a unique file name
        const fileName = `${documentType}_${Date.now()}_${req.file.originalname}`;

        // Upload file to S3 and get the file URL
        const documentUrl = await uploadFileToS3(req.file, fileName);

        // Dynamically update the document field in the visa record
        visa[`${documentType}_url`] = documentUrl;

        // Update visa status to "Pending"
        visa.status = "Pending";

        // Save the updated visa record
        await visa.save();

        // Respond with success message and updated visa record
        res.status(200).json({
        message: "File uploaded successfully and is now pending HR review",
        visa,
        });
    } catch (error) {
        // Handle errors and send appropriate response
        res.status(500).json({ message: `Error uploading file: ${error.message}` });
    }
};


// Get visa details for a user
export const getVisaDetails = async (req, res) => {
    const { user_id } = req.params;

    try {
        const visa = await Visa.findOne({ user_id }).populate("user_id", "username email");
        if (!visa) return res.status(404).json({ message: "Visa record not found" });

        res.status(200).json({ visa });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Reject or approve from HR
export const reviewDocument = async (req, res) => {
    const { user_id, documentType, action, feedback } = req.body;

    try {
        const visa = await Visa.findOne({ user_id });
        if (!visa) return res.status(404).json({ message: "Visa record not found" });

        if (action === "approve") {
        visa.status = "Complete";

        // Move to the next stage based on the current stage
        const stages = ["OPT Receipt", "EAD", "I983", "I20", "Complete"];
        const currentStageIndex = stages.indexOf(visa.stage);

        // Ensure the next stage exists
        if (currentStageIndex !== -1 && currentStageIndex < stages.length - 1) {
            visa.stage = stages[currentStageIndex + 1];
            visa.status = "Not Started"; // Reset status for the next stage
            visa.message=visa.stage=="Complete"?"All documents have been approved":`${visa.stage} stage`
        }
        } else if (action === "reject") {
        visa.status = "Reject";
        visa.message = feedback;
        }

        await visa.save();
        res.status(200).json({ message: `Document ${action}ed successfully`, visa });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to get in-progress visa applications
export const getInProgressVisas = async (req, res) => {
    try {
        // Fetch all visas not marked as "Complete"
        const incompleteVisas = await Visa.find({ stage: { $ne: "Complete" } });
        // Process each visa and fetch the corresponding EmployeeProfile
        const results = await Promise.all(
            incompleteVisas.map(async (visa) => {
                // Find the employee profile by user_id
                const profile = await EmployeeProfile.findOne({ user_id: visa.user_id });
                if (!profile) {
                    return null; // Skip if no profile is found
                }
                const user= await User.findOne({_id:visa.user_id})
                if (!user){
                    return null
                }
                // Calculate remaining visa days
                const today = new Date();
                const visaRemainingDays = profile.visa_end_date
                    ? Math.max(
                        Math.ceil((new Date(profile.visa_end_date) - today) / (1000 * 60 * 60 * 24)),
                        0
                    )
                    : null;
                // Combine visa and employee profile data

                // Format visa_start_date and visa_end_date to concise format
                const formattedVisaStartDate = profile.visa_start_date
                ? new Date(profile.visa_start_date).toISOString().split('T')[0]
                : null;
                const formattedVisaEndDate = profile.visa_end_date
                    ? new Date(profile.visa_end_date).toISOString().split('T')[0]
                    : null;
                return {
                    // Visa fields
                    user_id: visa.user_id,
                    is_opt: visa.is_opt,
                    stage: visa.stage,
                    status: visa.status,
                    opt_receipt_url: visa.opt_receipt_url,
                    opt_ead_url: visa.opt_ead_url,
                    i983_url: visa.i983_url,
                    i20_url: visa.i20_url,
                    message: visa.message,
                    // EmployeeProfile fields
                    visa_type: profile.visa_type,
                    visa_start_date: formattedVisaStartDate,
                    visa_end_date: formattedVisaEndDate,
                    visa_remaining_days: visaRemainingDays,
                    employee_name: `${profile.first_name} ${profile.last_name}`,
                    email:user.email,
                };
            })
        );
        // Filter out null results
        const Results = results.filter((result) => result !== null);
        // Return the results
        res.status(200).json({ Results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Get all visa-status employees based on name serach
export const searchEmployees = async (req, res) => {
    try {
        const { first_name, last_name, preferred_name } = req.query;

        // Build a dynamic search query
        const searchQuery = {};
        if (first_name) {
            searchQuery.first_name = { $regex: first_name, $options: "i" }; // Case-insensitive match
        }
        if (last_name) {
            searchQuery.last_name = { $regex: last_name, $options: "i" };
        }
        if (preferred_name) {
            searchQuery.preferred_name = { $regex: preferred_name, $options: "i" };
        }

        // Find matching EmployeeProfiles
        const profiles = await EmployeeProfile.find(searchQuery).lean();

        // Fetch Visa details for each matching employee
        const results = await Promise.all(
            profiles.map(async (profile) => {
                const visa = await Visa.findOne({ user_id: profile.user_id }).lean();

                // If no visa is found, skip this employee
                if (!visa) return null;

                // Calculate remaining visa days
                const today = new Date();
                const visaRemainingDays = profile.visa_end_date
                        ? Math.max(
                            Math.ceil((new Date(profile.visa_end_date) - today) / (1000 * 60 * 60 * 24)),
                            0
                        )
                        : null;

                // Combine profile and visa data
                return {
                    // Visa fields
                    user_id: visa.user_id,
                    is_opt: visa.is_opt,
                    stage: visa.stage,
                    status: visa.status,
                    opt_receipt_url: visa.opt_receipt_url,
                    opt_ead_url: visa.opt_ead_url,
                    i983_url: visa.i983_url,
                    i20_url: visa.i20_url,
                    message: visa.message,

                    // EmployeeProfile fields
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    preferred_name: profile.preferred_name,
                    visa_type: profile.visa_type,
                    visa_start_date: profile.visa_start_date,
                    visa_end_date: profile.visa_end_date,
                    visa_remaining_days: visaRemainingDays,
                };
            })
        );

        // Filter out null results
        const filteredResults = results.filter((result) => result !== null);

        // Return the list of matching employees
        res.status(200).json(filteredResults);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

//preview or download aws3 files
export const handleAws3=async(req,res)=>{
    const { key, type } = req.query;

    if (!key) {
        return res.status(400).json({ message: "Key is required" });
    }

    try {
        const url = await generatePresignedUrl(key, type);
        res.status(200).json({ url });
    } catch (error) {
        res.status(500).json({ message: `Failed to generate URL: ${error.message}` });
    }
}

//send notification
export const sendNotification=async (req, res) => {
        const { email, stage } = req.body;
    
        if (!email || !stage) {
        return res.status(400).json({ error: 'Email and document stage are required.' });
        }
    
        try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
            },
        });
    
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Document Upload Notification',
            text: `Dear User,
    
    You are required to upload the following document: ${stage}.
    
    Best regards,
    Visa Processing Team`,
        };
    
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    
        res.status(200).json({ message: 'Email sent successfully.' });
        } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
        }
}
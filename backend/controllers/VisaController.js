import Visa from "../models/Visa.js";
import User from "../models/User.js";
import { uploadFileToS3 } from "../middlewares/AwsS3Middleware.js"; // Import the file upload function
import mongoose from "mongoose";


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
        // Find all visa applications where the stage is not "Complete"
        const visas = await Visa.find({ stage: { $ne: "Complete" } })
        .populate("user_id", "username email") // Populate user details
        .exec();

        // Send the raw data directly to the frontend
        res.status(200).json(visas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get all visa-status employees
export const getAllVisaStatusEmployees = async (req, res) => {
  const { search } = req.query; // Extract search query from request

    try {
        // Build search condition based on firstName, lastName, or preferredName
        const searchCondition = search
        ? {
            $or: [
            { firstName: { $regex: search, $options: "i" } }, // Case-insensitive search for firstName
            { lastName: { $regex: search, $options: "i" } },  // Case-insensitive search for lastName
            { preferredName: { $regex: search, $options: "i" } }, // Case-insensitive search for preferredName
            ],
        }
        : {};

        // Find all visa records matching the search condition
        const visas = await Visa.find(searchCondition);

        // If no records are found, return a 404
        if (visas.length === 0) {
        return res.status(404).json({ message: "No records found" });
        }

        // Return the raw JSON data
        res.status(200).json(visas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  
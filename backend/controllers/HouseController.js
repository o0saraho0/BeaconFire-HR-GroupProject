import House from '../models/House.js';
import EmployeeProfile from '../models/EmployeeProfile.js';

export const createHouse = async (req, res) => {
    try {
        const house = new House(req.body);
        console.log(req.body);
        const savedHouse = await house.save();
        
        res.status(201).json({ message: 'House created successfully', house: savedHouse });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllHouses = async (req, res) => {
    try {
        const houses = await House.find();
        res.status(200).json(houses);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getHouseById = async (req, res) => {
    try {
        const house = await House.findById(req.params.id).populate('tenants');
        if (!house) return res.status(404).json({ error: 'House not found' });
        res.status(200).json(house);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getHouseByUserId = async (req, res) => {
    try {
        const userId = req.body.user_id; // Extracted from token
        console.log("Extracted userId:", userId);

        if (!userId) {
            console.log("No userId found in request");
            return res.status(400).json({ message: 'User ID is missing from the request' });
        }

        const house = await House.findOne({ tenants: userId }).populate({
            path: "tenants", // Populating tenants from User model
            model: "User",
        });
        console.log("House Found:", house);

        if (!house) {
            console.log("No house found for userId:", userId);
            return res.status(404).json({ message: 'No house found for the given user ID' });
        }

        const tenantDetails = await EmployeeProfile.find({
            user_id: { $in: house.tenants.map((tenant) => tenant._id) },
        });
        console.log("Tenant Details:", tenantDetails);

        const result = {
            ...house.toObject(),
            tenants: tenantDetails,
        };

        res.status(200).json({ house: result });
    } catch (error) {
        console.error("Error in getHouseByUserId:", error);
        res.status(500).json({ message: "Server error while retrieving house details" });
    }
};


export const deleteHouseById = async (req, res) => {
    try {
        const house = await House.findByIdAndDelete(req.params.id);
        if (!house) {
            return res.status(404).json({ error: 'House not found' });
        }
        res.status(200).json({ message: 'House deleted successfully', house });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
import House from '../models/House.js';

export const createHouse = async (req, res) => {
    try {
        const house = new House(req.body);
        await house.save();
        res.status(201).json({ message: 'House created successfully', house });
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
        const userId = req.body.user_id; // Extracted by jwtValidation middleware

        if (!userId) {
            return res.status(400).json({ message: 'User ID is missing from the request' });
        }

        // Find the house where the user is a tenant
        const house = await House.findOne({ tenants: userId });

        if (!house) {
            return res.status(404).json({ message: 'No house found for the given user ID' });
        }

        res.status(200).json({ house });
    } catch (error) {
        console.error('Error retrieving house by user ID:', error);
        res.status(500).json({ message: 'Server error while retrieving house details' });
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
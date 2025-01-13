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
import UserModel from "../models/User.js";
import HRProfile from "../models/HRProfile.js"
import EmployeeProfile from "../models/EmployeeProfile.js"
import JWTRevocationList from "../models/JWTRevocationList.js"

import HouseModel from "../models/House.js";

import * as argon2 from "argon2";

import { generateJWTToken } from "../utils/jwt.js";


export const loginUsingUsername = async (req, res) => {

    const { username, password } = req.body;

    try {
        const user = await UserModel.findOne({ username })
            .select("password")
            .lean().exec();

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials, Username Not found" });
        }
        //                                          db(hashed), raw input(password)
        const isPasswordCorrect = await argon2.verify(user.password, password);
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid credentials, Password incorrect" });

        const token = generateJWTToken(user._id, user.username, user.email);

        res.status(200).json({ message: "Logged in successfully", token, user_id: user._id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

export const createUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUsername = await UserModel.findOne({ username }).lean().exec();
        if (existingUsername) {
            return res.status(409).json({ message: "Account already registered with this username" });
        }

        const existingEmail = await UserModel.findOne({ email }).lean().exec();
        if (existingEmail) {
            return res.status(409).json({ message: "Account already registered with this email" });
        }

        const hashedPassword = await argon2.hash(password);
        const newUser = await UserModel.create({ username, email, password: hashedPassword });
        const token = generateJWTToken(newUser._id, username, email);


        // `house` would be an array containing the randomly selected house document.
        const house = await HouseModel.aggregate([{ $sample: { size: 1 } }]);
        if (!house || house.length === 0) {
            throw new Error("No houses available for assignment");
        }

        await HouseModel.findByIdAndUpdate(
            house[0]._id,
            { $push: { tenants: newUser._id } }
        );

        await newUser.save();

        res.status(201).json({ message: "User created successfully", token, "user_id": newUser._id });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
}

export const logoutUser = async (req, res) => {
    try {

        const token = req.headers.authorization.split(' ')[1];

        await JWTRevocationList.create({ token }) // remoke/blacklist/invalidate the JWT in our db

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

export const getUserDetail = async (req, res) => {
    try {
        const user_id = req.body.user_id
        // 1. query to see if there exist a document in HRProfile Collection

        const hr = await HRProfile.findOne({ user_id })

        if (hr) {
            return res.status(200).json({ role: "hr", info: { ...hr } });
        }

        // 2. query to see if there exist a document in EmployeeProfile Collection
        const employee = await EmployeeProfile.findOne({ user_id })

        if (employee) {
            return res.status(200).json({ role: "employee", info: { ...employee } });
        }

        // 3. If both not found, it means that user not yet completed the onboarding applicaiton, 
        // use other APIs to query Application details

        return res.status(204).json({ role: "", info: {} }) // HTTP 204: No Content


    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}
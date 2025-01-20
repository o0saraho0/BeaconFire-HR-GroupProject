import mongoose from "mongoose";
import dotenv from "dotenv";
import Application from "./models/Application.js";
import EmployeeProfile from "./models/EmployeeProfile.js";
import FacilityReport from "./models/FacilityReport.js";
import House from "./models/House.js";
import HRProfile from "./models/HRProfile.js";
import Registration from "./models/Registration.js";
import User from "./models/User.js";
import Visa from "./models/Visa.js";
import * as argon2 from "argon2";

dotenv.config();

// MongoDB Connection
const connect_DB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Seed Database
const seed_database = async () => {
  try {
    // Clear existing data
    await HRProfile.deleteMany({});
    await EmployeeProfile.deleteMany({});
    await FacilityReport.deleteMany({});
    await House.deleteMany({});
    await Registration.deleteMany({});
    await Application.deleteMany({});
    await Visa.deleteMany({});
    await User.deleteMany({});
    const hashedPassword = await argon2.hash("password1");

    // Create Users
    const users = await User.insertMany([
      { username: "hr1", email: "hr1@example.com", password: hashedPassword },
    ]);

    console.log("Users created:", users);

    // Create HR Profiles
    const hr_profiles = await HRProfile.insertMany([
      {
        user_id: users[0]._id,
        first_name: "Cate",
        last_name: "Zeng",
      }
    ]);
    console.log("HR Profiles created:", hr_profiles);

    // Create Houses
    const houses = await House.insertMany([
      {
        tenants: [users[0]._id],
        address: {
          building: "123",
          street: "Main St",
          city: "San Francisco",
          state: "CA",
          zip: "94105",
        },
        landlord: {
          first_name: "Charlie",
          last_name: "White",
          phone_number: "9998887777",
          email: "charlie@example.com",
        },
        beds: 3,
        mattresses: 3,
        tables: 1,
        chairs: 4,
      }
    ]);
    console.log("Houses created:", houses);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Main Execution
const main = async () => {
  await connect_DB();
  await seed_database();
};

main();
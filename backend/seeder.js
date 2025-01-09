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

    // Create Users
    const users = await User.insertMany([
      {
        username: "employee1",
        email: "employee1@example.com",
        password: "password1",
      },
      {
        username: "employee2",
        email: "employee2@example.com",
        password: "password2",
      },
      {
        username: "employee3",
        email: "employee3@example.com",
        password: "password3",
      },
      {
        username: "employee4",
        email: "employee4@example.com",
        password: "password4",
      },
      {
        username: "employee5",
        email: "employee5@example.com",
        password: "password5",
      },
      { username: "hr1", email: "hr1@example.com", password: "password6" },
      { username: "hr2", email: "hr2@example.com", password: "password7" },
    ]);
    console.log("Users created:", users);

    // Create Employee Profiles
    const employeeProfiles = await EmployeeProfile.insertMany([
      {
        user_id: users[0]._id,
        first_name: "John",
        last_name: "Doe",
        address: {
          building: "101",
          street: "Main St",
          city: "San Francisco",
          state: "CA",
          zip: "94105",
        },
        cell_phone: "123-456-7890",
        dob: new Date("1990-01-01"),
        gender: "Male",
        car_make: "Toyota",
        car_model: "Corolla",
        car_color: "Blue",
        ssn: "123456789",
        visa_type: "H1B Category",
        reference: {
          first_name: "Alice",
          last_name: "Smith",
          phone: "9876543210",
          email: "alice.smith@example.com",
          relationship: "Manager",
        },
        emergency_contacts: [
          {
            first_name: "Alice",
            last_name: "Smith",
            phone: "9876543210",
            email: "alice.smith@example.com",
            relationship: "Manager",
          },
        ],
      },
      {
        user_id: users[1]._id,
        first_name: "Jane",
        last_name: "Smith",
        address: {
          building: "202",
          street: "Market St",
          city: "San Francisco",
          state: "CA",
          zip: "94107",
        },
        cell_phone: "9876543210",
        dob: new Date("1988-05-10"),
        gender: "Female",
        car_make: "Honda",
        car_model: "Civic",
        car_color: "Red",
        ssn: "234567890",
        visa_type: "F1 Category",
        reference: {
          first_name: "Bob",
          last_name: "Johnson",
          phone: "1234567890",
          email: "bob.johnson@example.com",
          relationship: "Supervisor",
        },
        emergency_contacts: [
          {
            first_name: "Bob",
            last_name: "Johnson",
            phone: "1234567890",
            email: "bob.johnson@example.com",
            relationship: "Supervisor",
          },
        ],
      },
      {
        user_id: users[2]._id,
        first_name: "Emily",
        last_name: "Clark",
        address: {
          building: "303",
          street: "Broadway",
          city: "New York",
          state: "NY",
          zip: "10001",
        },
        cell_phone: "4567891234",
        dob: new Date("1995-07-15"),
        gender: "Female",
        car_make: "Ford",
        car_model: "Focus",
        car_color: "White",
        ssn: "345678901",
        visa_type: "Green Card",
        reference: {
          first_name: "Charlie",
          last_name: "Brown",
          phone: "9871234567",
          email: "charlie.brown@example.com",
          relationship: "Coworker",
        },
        emergency_contacts: [
          {
            first_name: "Charlie",
            last_name: "Brown",
            phone: "9871234567",
            email: "charlie.brown@example.com",
            relationship: "Coworker",
          },
        ],
      },
      {
        user_id: users[3]._id,
        first_name: "Michael",
        last_name: "Brown",
        address: {
          building: "404",
          street: "Elm St",
          city: "Chicago",
          state: "IL",
          zip: "60614",
        },
        cell_phone: "1112223333",
        dob: new Date("1992-03-20"),
        gender: "Male",
        car_make: "Chevrolet",
        car_model: "Impala",
        car_color: "Black",
        ssn: "456789012",
        visa_type: "Citizen",
        reference: {
          first_name: "David",
          last_name: "Green",
          phone: "3334445555",
          email: "david.green@example.com",
          relationship: "Mentor",
        },
        emergency_contacts: [
          {
            first_name: "David",
            last_name: "Green",
            phone: "3334445555",
            email: "david.green@example.com",
            relationship: "Mentor",
          },
        ],
      },
      {
        user_id: users[4]._id,
        first_name: "Sarah",
        last_name: "Johnson",
        address: {
          building: "505",
          street: "Oak St",
          city: "Seattle",
          state: "WA",
          zip: "98101",
        },
        cell_phone: "5556667777",
        dob: new Date("1985-11-30"),
        gender: "Female",
        car_make: "Nissan",
        car_model: "Altima",
        car_color: "Silver",
        ssn: "567890123",
        visa_type: "Other",
        reference: {
          first_name: "Emily",
          last_name: "White",
          phone: "2223334444",
          email: "emily.white@example.com",
          relationship: "Colleague",
        },
        emergency_contacts: [
          {
            first_name: "Emily",
            last_name: "White",
            phone: "2223334444",
            email: "emily.white@example.com",
            relationship: "Colleague",
          },
        ],
      },
    ]);
    console.log("Employee Profiles created:", employeeProfiles);

    // Create HR Profiles (Link to next 2 users)
    const hr_profiles = await HRProfile.insertMany([
      {
        user_id: users[5]._id,
        first_name: "Cate",
        last_name: "Zeng",
      },
      {
        user_id: users[6]._id,
        first_name: "Josie",
        last_name: "Yan",
      },
    ]);
    console.log("HR Profiles created:", hr_profiles);

    // Create Houses
    const houses = await House.insertMany([
      {
        tenants: [users[0]._id, users[1]._id],
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
      },
      {
        tenants: [users[2]._id],
        address: {
          building: "234",
          street: "Broadway",
          city: "New York",
          state: "NY",
          zip: "10001",
        },
        landlord: {
          first_name: "Daisy",
          last_name: "Green",
          phone_number: "2223334444",
          email: "daisy@example.com",
        },
        beds: 2,
        mattresses: 2,
        tables: 1,
        chairs: 3,
      },
      {
        tenants: [users[3]._id, users[4]._id],
        address: {
          building: "345",
          street: "Elm St",
          city: "Chicago",
          state: "IL",
          zip: "60614",
        },
        landlord: {
          first_name: "Edward",
          last_name: "Brown",
          phone_number: "5554443333",
          email: "edward@example.com",
        },
        beds: 4,
        mattresses: 4,
        tables: 2,
        chairs: 6,
      },
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

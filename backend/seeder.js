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
      {
        username: "employee1",
        email: "employee1@example.com",
        password: hashedPassword,
      },
      {
        username: "employee2",
        email: "employee2@example.com",
        password: hashedPassword,
      },
      {
        username: "employee3",
        email: "employee3@example.com",
        password: hashedPassword,
      },
      {
        username: "employee4",
        email: "employee4@example.com",
        password: hashedPassword,
      },
      {
        username: "employee5",
        email: "employee5@example.com",
        password: hashedPassword,
      },
      {
        username: "employee0",
        email: "employee0@example.com",
        password: hashedPassword,
      },
      { username: "hr1", email: "hr1@example.com", password: hashedPassword },
      { username: "hr2", email: "hr2@example.com", password: hashedPassword },
    ]);

    console.log("Users created:", users);

    // Create Employee Profiles
    const employee_profiles = await EmployeeProfile.insertMany([
      {
        user_id: users[0]._id,
        first_name: "John",
        last_name: "Doe",
        middle_name: "J",
        preferred_name: "JD",
        current_address: {
          building: "101",
          street: "Main St",
          city: "San Francisco",
          state: "CA",
          zip: "94105",
        },
        cell_phone: "1234567890",
        dob: new Date("1990-01-01"),
        gender: "Male",
        car_make: "Toyota",
        car_model: "Corolla",
        car_color: "Blue",
        ssn: "123456789",
        visa_type: "H1B",
        visa_start_date: new Date("2025-01-01"),
        visa_end_date: new Date("2028-01-01"),
        reference: {
          first_name: "Alice",
          last_name: "Reference",
          phone: "9876543210",
          email: "alice.smith@example.com",
          relationship: "Manager",
        },
        emergency_contacts: [
          {
            first_name: "Alice",
            last_name: "Emergency",
            phone: "9876543210",
            email: "alice.emergency@example.com",
            relationship: "Mother",
          },
          {
            first_name: "Bob",
            last_name: "Emergency",
            phone: "9876543210",
            email: "bob.emergency@example.com",
            relationship: "Spouse",
          },
        ],
        profile_picture_url: "/images/default-user.png",
      },
      {
        user_id: users[1]._id,
        first_name: "Jane",
        last_name: "Smith",
        current_address: {
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
        visa_type: "F1",
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
        current_address: {
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
        current_address: {
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
        current_address: {
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
        visa_type: "F1",
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
    console.log("Employee Profiles created:", employee_profiles);

    // Create Visa documents for each employee
    const visas = await Visa.insertMany(employee_profiles.map(profile => ({
      user_id: profile.user_id,
      is_opt: profile.visa_type === "F1", // Set is_opt based on visa type
      stage: profile.visa_type === "F1" ? "OPT Receipt" : "Complete", // Set stage based on visa type
      status: "Pending",
      status: 'Pending',
      opt_receipt_url: profile.visa_type === "F1" ? "https://hr-management-bucket666.s3.us-east-1.amazonaws.com/visa-documents/opt-receipts/1737400614153-2.png" : null,
      opt_ead_url: null,
      i983_url: null,
      i20_url: null,
      message: null
    })));
    console.log("Visa documents created:", visas);

    // Create HR Profiles
    const hr_profiles = await HRProfile.insertMany([
      {
        user_id: users[6]._id,
        first_name: "Cate",
        last_name: "Zeng",
      },
      {
        user_id: users[7]._id,
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
        tenants: [users[3]._id],
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

    // Create Facility Reports
    const facility_reports = await FacilityReport.insertMany([
      {
        house_id: houses[0]._id,
        title: "Leaky Faucet in Kitchen",
        description:
          "The kitchen faucet is leaking and needs immediate repair.",
        created_by: users[0]._id,
        status: "Open",
        comments: [
          {
            posted_by: "employee",
            description: "Reported the issue to the landlord.",
          },
        ],
      },
      {
        house_id: houses[2]._id,
        title: "Broken Window in Living Room",
        description:
          "A window in the living room is broken and poses a security risk.",
        created_by: users[3]._id,
        status: "In Progress",
        comments: [
          {
            posted_by: "hr",
            description: "Contacted the repair service to fix the window.",
          },
        ],
      },
    ]);
    console.log("Facility Reports created:", facility_reports);

    // Create Applications
    const applications = await Application.insertMany([
      {
        user_id: users[0]._id,
        status: "Approved",
        first_name: "John",
        last_name: "Doe",
        middle_name: "J",
        preferred_name: "JD",
        current_address: {
          building: "101",
          street: "Main St",
          city: "San Francisco",
          state: "CA",
          zip: "94105",
        },
        cell_phone: "1234567890",
        work_phone: "1234567890",
        car_make: "Toyota",
        car_model: "Corolla",
        car_color: "Blue",
        ssn: "123-45-6789", // Changed from Date to String
        dob: "1990-01-01", // Changed from Date to String
        gender: "Male",
        visa_type: "H1B",
        visa_start_date: "2025-01-01", // Changed from Date to String
        visa_end_date: "2028-01-01", // Changed from Date to String
        driver_licence_number: "DL123456",
        driver_license_expire_date: "2025-12-31", // Changed from Date to String
        reference: {
          first_name: "Alice",
          last_name: "Reference",
          middle_name: "M",
          phone: "9876543210",
          email: "alice.smith@example.com",
          relationship: "Manager",
        },
        emergency_contacts: [
          {
            first_name: "Alice",
            last_name: "Emergency",
            middle_name: "M",
            phone: "9876543210",
            email: "alice.emergency@example.com",
            relationship: "Mother",
          }
        ],
        profile_picture_url: "profile1.jpg",
        driver_licence_url: "license1.pdf",
        work_auth_url: "workauth1.pdf"
      },
      {
        user_id: users[1]._id,
        status: "Approved",
        first_name: "Jane",
        last_name: "Smith",
        current_address: {
          building: "202",
          street: "Market St",
          city: "San Francisco",
          state: "CA",
          zip: "94107",
        },
        cell_phone: "9876543210",
        ssn: "987-65-4321", // Changed from Date to String
        dob: "1988-05-10", // Changed from Date to String
        gender: "Female",
        visa_type: "F1",
        driver_licence_number: "DL789012",
        driver_license_expire_date: "2024-06-30", // Changed from Date to String
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
          }
        ],
        profile_picture_url: "profile2.jpg",
        driver_licence_url: "license2.pdf",
        work_auth_url: "workauth2.pdf"
      }
    ]);
    console.log("Applications created:", applications);

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
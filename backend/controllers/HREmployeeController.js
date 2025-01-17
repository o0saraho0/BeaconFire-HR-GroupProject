import EmployeeProfile from "../models/EmployeeProfile.js";

const getAllEmployees = async (req, res) => {
  try {
    const profiles = await EmployeeProfile.find();
    if (!profiles) {
      return res.status(404).json({ message: "Employee profile not found." });
    }
    res.json(profiles);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getEmployeeById = async (req, res) => {
  try {
    console.log(userId);
    const userId = req.params.employeeId;
    const profile = await EmployeeProfile.findOne({ user_id: userId });
    if (!profile) {
      return res.status(404).json({ message: "Employee profile not found." });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

export { getAllEmployees, getEmployeeById };

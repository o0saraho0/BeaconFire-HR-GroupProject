import EmployeeProfile from "../models/EmployeeProfile.js";

const getEmployeeProfile = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const profile = await EmployeeProfile.findOne({ user_id: userId }).populate(
      "user_id"
    );
    if (!profile) {
      return res.status(404).json({ message: "Employee profile not found." });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const updatedData = req.body;
    const profile = await EmployeeProfile.findOneAndUpdate(
      { user_id: userId },
      updatedData,
      { new: true }
    ).populate("user_id");
    if (!profile) {
      return res.status(404).json({ message: "Employee profile not found." });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
export { getEmployeeProfile, updateProfile };

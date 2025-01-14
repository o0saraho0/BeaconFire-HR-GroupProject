import { uploadFileToS3 } from "../middlewares/AwsS3Middleware.js";

export const uploadProfilePicture = async (req, res) => {
  try {
    const file = req.file;
    const fileName = `profile-pictures/${Date.now()}-${file.originalname}`;
    const fileUrl = await uploadFileToS3(file, fileName);
    res.status(200).json({ success: true, fileUrl, key: fileName });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadDriverLicense = async (req, res) => {
  try {
    const file = req.file;
    const fileName = `driver-licenses/${Date.now()}-${file.originalname}`;
    const fileUrl = await uploadFileToS3(file, fileName);
    res.status(200).json({ success: true, fileUrl, key: fileName });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const uploadOptReceipt = async (req, res) => {
  try {
    const file = req.file;
    const fileName = `opt-receipts/${Date.now()}-${file.originalname}`;
    const fileUrl = await uploadFileToS3(file, fileName);
    res.status(200).json({ success: true, fileUrl, key: fileName });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
import Application from "../models/Application";

const getApplicationStatus = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

const postOnboarding = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      preferredName,
      profilePicture,
      currentAddress,
      cellPhone,
      workPhone,
      carInfo,
      email, // cannot be edited
      ssn,
      dob,
      gender,
      visaType,
      visaStartDate,
      visaEndDate,
      driverLicense,
      reference,
      emergencyContacts,
      uploadedFiles
    } = req.body;

    if (!firstName || !lastName || !cellPhone || !ssn || !dob || !visaType || !driverLicense || !emergencyContacts) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const applicationData = {
      user_id: req.user.id,
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      preferred_name: preferredName,
      profile_picture_url: profilePicture || 'default-placeholder-url',
      current_address: currentAddress,
      cell_phone: cellPhone,
      work_phone: workPhone,
      car_make: carInfo?.make,
      car_model: carInfo?.model,
      car_color: carInfo?.color,
      email, // email cannot be edited
      ssn,
      dob,
      gender,
      visa_type: visaType,
      visa_start_date: visaStartDate,
      visa_end_date: visaEndDate,
      driver_licence_number: driverLicense?.number,
      driver_license_expire_date: driverLicense?.expireDate,
      reference,
      emergency_contacts: emergencyContacts,
      driver_licence_url: uploadedFiles?.driverLicense,
      work_auth_url: uploadedFiles?.workAuthorization
    };

    const application = await Application.create(applicationData);

    res.status(201).json({ message: "Onboarding completed successfully", application });
  } catch (error) {
    console.error("Error in postOnboarding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getApplicationStatus, postOnboarding };
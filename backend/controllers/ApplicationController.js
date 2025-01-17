import Application from "../models/Application.js";

const getApplicationStatus = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const email = req.body.email;
    let application = await Application.findOne({ user_id: userId });
    console.log('email', email)
    if (!application) {
      return res.json({ status: 'Not Started', email: email });
    }
    return res.json({ application: application, email: email });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}

const postOnboarding = async (req, res) => {
  try {
    const userId = req.body.user_id;

    let application = await Application.findOne({ user_id: userId });

    if (!application) {
      application = await Application.create({
        user_id: userId,
        status: 'Pending',
      });
    }
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

    if (!firstName || !lastName || !cellPhone || !ssn || !dob || !visaType || !driverLicense?.number || !emergencyContacts) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const applicationData = {
      user_id: req.user.id,
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      preferred_name: preferredName,
      profile_picture_url: profilePicture || 'default-placeholder-url',
      current_address: {
        building: currentAddress?.building,
        street: currentAddress?.street,
        city: currentAddress?.city,
        state: currentAddress?.state,
        zip: currentAddress?.zip,
      },
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
      reference: {
        first_name: reference?.firstName,
        last_name: reference?.lastName,
        middle_name: reference?.middleName,
        phone: reference?.phone,
        email: reference?.email,
        relationship: reference?.relationship,
      },
      emergency_contacts: emergencyContacts.map(contact => ({
        first_name: contact.firstName,
        last_name: contact.lastName,
        middle_name: contact.middleName,
        phone: contact.phone,
        email: contact.email,
        relationship: contact.relationship,
      })),
      driver_licence_url: uploadedFiles?.driverLicense,
      work_auth_url: uploadedFiles?.workAuthorization
    };

    await application.update(applicationData);

    res.status(201).json({ message: "Onboarding completed successfully", application });
  } catch (error) {
    console.error("Error in postOnboarding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { getApplicationStatus, postOnboarding };
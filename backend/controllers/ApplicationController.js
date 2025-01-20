import Application from "../models/Application.js";
import User from "../models/User.js";
import EmployeeProfile from "../models/EmployeeProfile.js";
import Visa from "../models/Visa.js"

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
    console.log('req body', {
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
    });
    const applicationData = {
      user_id: userId,
      first_name: firstName,
      last_name: lastName,
      middle_name: middleName,
      preferred_name: preferredName,
      profile_picture_url: profilePicture,
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
      work_auth_url: uploadedFiles?.workAuthorization,
      driver_licence_number: driverLicense?.number,
      driver_license_expire_date: driverLicense?.expireDate,
    };

    let application = await Application.findOne({ user_id: userId });


    if (!application) {
      console.log('application not found');
      application = await Application.create({
        ...applicationData,
        status: 'Pending',
      });
    } else if (application.status === 'Rejected') {
      await Application.updateOne({ user_id: userId }, { ...applicationData, status: 'Pending' });
    } else {
      await Application.updateOne({ user_id: userId }, applicationData);
    }

    console.log('application created or updated', application);

    if (!firstName || !lastName || !currentAddress || !cellPhone || !ssn || !dob || !visaType || !driverLicense?.number || !driverLicense?.expireDate || !emergencyContacts) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    console.log('application data', applicationData);

    res.status(201).json({ message: "Onboarding completed successfully", application });
  } catch (error) {
    console.error("Error in postOnboarding:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getAllOnboardingApplications = async (req, res) => {
  try {
    const applications = await Application.find({}).select('first_name last_name user_id status')
      .lean()    // Returns plain JavaScript objects instead of Mongoose documents
      .exec();

    const userIds = applications.map(app => app.user_id);
    const users = await User.find({ _id: { $in: userIds } })
      .select('email')
      .lean();

    // Create a map of userId to email for quick lookup
    const userEmailMap = {};
    users.forEach(user => {
      userEmailMap[user._id] = user.email;
    });

    // Add email to each application
    const applicationsWithEmail = applications.map(app => ({
      ...app,
      email: userEmailMap[app.user_id]
    }));

    res.json({ applications: applicationsWithEmail });
  } catch (error) {
    console.error("Error in getAllOnboardingApplications:", error);
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

export const getApplicationDetailUsingApplicationId = async (req, res) => {
  try {
    const application_id = req.params.applicationId

    if (!application_id || application_id === 'undefined') {
      console.log(application_id)
      return res.status(401).json({ message: `Not Found` })
    }

    const application = await Application.findOne({ _id: application_id }).lean().exec()

    res.json({ application })
  }
  catch (error) {
    console.error(error)
    res.status(500).json({ message: `Internal server error: ${error}` });
  }
}

export const approveApplicationUsingApplicationId = async (req, res) => {

  try {
    const application_id = req.params.applicationId;

    console.log(application_id)
    if (!application_id) {
      return res.status(400).json({ message: "Application ID is required" });
    }

    const application = await Application.findById(application_id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Check if employee profile already exists
    const existingEmployee = await EmployeeProfile.findOne({ user_id: application.user_id });
    if (existingEmployee) {

      return res.status(400).json({ message: "A document for EmployeeProfile collection for user_id already exists" });
    }

    // Check if visa document already exists
    const existingVisa = await Visa.findOne({ user_id: application.user_id });
    if (existingVisa) {
      return res.status(400).json({ message: "A document in Visa Collection for user_id already exists" });
    }

    // Create a new employee profile from the application data
    const employeeProfileData = {
      user_id: application.user_id,
      first_name: application.first_name,
      last_name: application.last_name,
      middle_name: application.middle_name,
      preferred_name: application.preferred_name,
      current_address: {
        building: application.current_address?.building,
        street: application.current_address?.street,
        city: application.current_address?.city,
        state: application.current_address?.state,
        zip: application.current_address?.zip,
      },
      cell_phone: application.cell_phone,
      work_phone: application.work_phone,
      car_make: application.car_make,
      car_model: application.car_model,
      car_color: application.car_color,
      ssn: application.ssn,
      dob: application.dob,
      gender: application.gender,
      visa_type: application.visa_type,
      visa_start_date: application.visa_start_date,
      visa_end_date: application.visa_end_date,
      driver_licence_number: application.driver_licence_number,
      driver_license_expire_date: application.driver_license_expire_date,
      reference: {
        first_name: application.reference?.first_name,
        last_name: application.reference?.last_name,
        middle_name: application.reference?.middle_name,
        phone: application.reference?.phone,
        email: application.reference?.email,
        relationship: application.reference?.relationship,
      },
      emergency_contacts: application.emergency_contacts?.map(contact => ({
        first_name: contact.first_name,
        last_name: contact.last_name,
        middle_name: contact.middle_name,
        phone: contact.phone,
        email: contact.email,
        relationship: contact.relationship,
      })),
      profile_picture_url: application.profile_picture_url,
      driver_licence_url: application.driver_licence_url,
      work_auth_url: application.work_auth_url,
    };

    // Create or update Visa document
    const visaData = {
      user_id: application.user_id,
      is_opt: application.visa_type === 'F1',
      stage: 'OPT Receipt', // Initial stage for new visa documents
      status: 'Pending',
      opt_receipt_url: application.work_auth_url,
      opt_ead_url: null,
      i983_url: null,
      i20_url: null,
      message: null
    };

    // Create new EmployeeProfile document
    const newEmployeeProfile = await EmployeeProfile.create(employeeProfileData);

    // Create new Visa document
    const newVisa = await Visa.create(visaData);


    // Update application status
    await Application.findByIdAndUpdate(
      application_id,
      { status: 'Approved' },
    );


    return res.json({ message: "Application approved successfully", application });
  } catch (error) {

    console.error("Error in approveApplicationUsingApplicationId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const rejectApplicationUsingApplicationId = async (req, res) => {
  try {
    const application_id = req.params.applicationId;
    const feedback = req.body.feedback;

    if (!application_id) {
      return res.status(400).json({ message: "Application ID is required" });
    }

    if (!feedback) {
      return res.status(400).json({ message: "Feedback is required for rejection" });
    }

    const application = await Application.findByIdAndUpdate(
      application_id,
      {
        status: 'Rejected',
        feedback: feedback
      }
    );

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({ message: "Application rejected successfully", application });
  } catch (error) {
    console.error("Error in rejectApplicationUsingApplicationId:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export { getApplicationStatus, postOnboarding };
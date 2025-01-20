import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEmployeeProfile,
  updateEmployeeProfile,
} from "../../store/employeeSlice/employee.slice";

// docoments
import axios from "../../interceptors/auth.interceptor";
import {
  setDocumentKey,
  selectUserDocuments,
} from "../../store/documentSlice/documentSlice";

import {
  Button,
  TextField,
  Box,
  Typography,
  Paper,
  Select,
  MenuItem,
} from "@mui/material";
import "./PersonalProfile.css";

const PersonalProfile = () => {
  const [editingSection, setEditingSection] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    middle_name: "",
    preferred_name: "",
    current_address: {
      building: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    email: "",
    cell_phone: "",
    work_phone: "",
    car_make: "",
    car_model: "",
    car_color: "",
    ssn: "",
    dob: "",
    gender: "",
    visa_type: "",
    visa_start_date: "",
    visa_end_date: "",
    driver_licence_number: "",
    driver_license_expire_date: "",
    reference: {
      first_name: "",
      last_name: "",
      middle_name: "",
      phone: "",
      email: "",
      relationship: "",
    },
    emergency_contacts: [
      {
        first_name: "",
        last_name: "",
        middle_name: "",
        phone: "",
        email: "",
        relationship: "",
      },
    ],
    profile_picture_url: "",
    driver_licence_url: "",
    work_auth_url: "",
    additional_url: "",
  });

  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.employee);
  const { userId } = useSelector((state) => state.auth);

  // documents
  const userDocuments = useSelector((state) =>
    selectUserDocuments(state, userId)
  );
  const [uploadedProfilePicture, setProfilePicture] = useState("");
  const [uploadedDriverLicense, setDriverLicense] = useState("");
  const [uploadedWorkAuth, setWorkAuth] = useState("");

  useEffect(() => {
    if (userId) {
      dispatch(fetchEmployeeProfile(userId));
    }
  }, [userId, dispatch]);

  // useEffect(() => {
  //   if (profile) {
  //     setFormData(profile);
  //   }
  // }, [profile]);

  useEffect(() => {
    if (profile) {
      const updatedProfile = {
        ...profile,
        email: profile.user_id?.email,
      };

      setFormData(updatedProfile);
    }
  }, [profile]);

  console.log(profile);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      alert("To update your email, please contact HR.");
      return;
    }

    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prevState) => {
        // Create a deep copy of the previous state
        const newFormData = JSON.parse(JSON.stringify(prevState));

        // Traverse to the nested field
        let nestedField = newFormData;
        for (let i = 0; i < keys.length - 1; i++) {
          nestedField = nestedField[keys[i]];
        }

        // Update the value
        nestedField[keys[keys.length - 1]] = value;

        return newFormData;
      });
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // docoments
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    switch (e.target.name) {
      case "profile_picture_url":
        setProfilePicture(fileName);
        break;
      case "driver_licence_url":
        setDriverLicense(fileName);
        break;
      case "work_auth_url":
        setWorkAuth(fileName);
        break;
      default:
        return;
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    let endpoint = "";
    switch (e.target.name) {
      case "profile_picture_url":
        endpoint = "/api/upload/profile-picture";
        break;
      case "driver_licence_url":
        endpoint = "/api/upload/driver-license";
        break;
      case "work_auth_url":
        endpoint = "/api/upload/opt-receipt";
        break;
      default:
        return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000${endpoint}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("upload response", response);
      dispatch(
        setDocumentKey({
          userId,
          documentType: e.target.name,
          key: response.data.key,
        })
      );
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: response.data.fileUrl,
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const forceDownload = (link) => {
    const url = link;
    const fileName = link.split("/").pop() || "download";

    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);

        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(blobUrl);
      })
      .catch((error) => {
        console.error("File download failed:", error);
      });
  };

  // const getPresignedUrl = async (fileName) => {
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3000/api/upload/presigned-url`,
  //       {
  //         params: { fileName },
  //       }
  //     );
  //     return response.data.url;
  //   } catch (error) {
  //     console.error("Error fetching pre-signed URL:", error);
  //   }
  // };

  const handleEditClick = (section) => {
    setEditingSection(section);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.first_name.trim()) {
      errors.first_name = "First name is required.";
    }
    if (!formData.last_name.trim()) {
      errors.last_name = "Last name is required.";
    }

    if (!formData.ssn.trim()) {
      errors.ssn = "SSN is required.";
    } else if (!/^\d+$/.test(formData.ssn)) {
      errors.ssn = "SSN must be numeric.";
    }
    if (!formData.cell_phone.trim()) {
      errors.cell_phone = "Cell phone is required.";
    }
    if (formData.cell_phone && !/^\d+$/.test(formData.cell_phone)) {
      errors.cell_phone = "Cell phone must be numeric.";
    }
    if (formData.work_phone && !/^\d+$/.test(formData.work_phone)) {
      errors.work_phone = "Work phone must be numeric.";
    }
    if (formData.dob && new Date(formData.dob) > new Date()) {
      errors.dob = "Date of birth cannot be in the future.";
    }
    if (formData.visa_start_date && formData.visa_end_date) {
      const visaStart = new Date(formData.visa_start_date);
      const visaEnd = new Date(formData.visa_end_date);

      if (visaStart >= visaEnd) {
        errors.visa_dates = "Visa start date must be before visa end date.";
      }
    }
    if (formData.emergency_contacts?.length > 0) {
      const emergencyErrors = [];
      formData.emergency_contacts.forEach((contact, index) => {
        const contactErrors = {};
        if (!contact.first_name?.trim()) {
          contactErrors.first_name = "First name is required.";
        }
        if (!contact.last_name?.trim()) {
          contactErrors.last_name = "Last name is required.";
        }
        if (
          contact.email &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)
        ) {
          contactErrors.email = "Invalid email format.";
        }

        if (Object.keys(contactErrors).length > 0) {
          emergencyErrors[index] = contactErrors;
        }
      });

      if (emergencyErrors.length > 0) {
        errors.emergency_contacts = emergencyErrors;
      }
    }
    return errors;
  };

  const formatErrors = (errors) => {
    let errorMessages = [];

    for (const [key, value] of Object.entries(errors)) {
      if (Array.isArray(value)) {
        value.forEach((contactErrors, index) => {
          for (const [field, message] of Object.entries(contactErrors)) {
            errorMessages.push(`Emergency Contact ${index + 1}: ${message}`);
          }
        });
      } else {
        errorMessages.push(`${value}`);
      }
    }
    return errorMessages.join("\n");
  };

  const handleSaveClick = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      console.error("Validation errors:", validationErrors);

      alert(
        `Please fix the following errors:\n${formatErrors(validationErrors)}`
      );
      return;
    }
    try {
      dispatch(updateEmployeeProfile(formData));
      setEditingSection(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelClick = () => {
    const confirmDiscard = window.confirm(
      "Are you sure you want to discard all changes?"
    );
    if (confirmDiscard) {
      setFormData(profile);
      setEditingSection(null);
    }
  };

  // Dropdown management
  const visaTypes = [
    "Green Card",
    "Citizen",
    "H1B Category",
    "F1 Category",
    "Other",
  ];
  const genders = ["Male", "Female", "I do not wish to answer"];

  // Date management
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    return date.toISOString().split("T")[0];
  };

  const renderSection = (sectionName, fields, isArray = false) => {
    const isEditing = editingSection === sectionName;

    return (
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Box>
          <Typography
            variant="h6"
            className="section-header"
            sx={{ marginBottom: 2 }}
          >
            {sectionName}
          </Typography>

          {isArray
            ? formData[fields]?.map((contact, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                  {isEditing ? (
                    [
                      { label: "First Name", key: "first_name" },
                      { label: "Last Name", key: "last_name" },
                      { label: "Middle Name", key: "middle_name" },
                      { label: "Phone", key: "phone" },
                      { label: "Email", key: "email" },
                      { label: "Relationship", key: "relationship" },
                    ].map(({ label, key }) => (
                      <TextField
                        key={key}
                        fullWidth
                        label={label}
                        name={`${fields}.${index}.${key}`}
                        value={contact[key] || ""}
                        onChange={handleChange}
                        sx={{ marginBottom: 1 }}
                      />
                    ))
                  ) : (
                    <Box>
                      <Typography>
                        <strong>First Name:</strong> {contact.first_name || ""}
                      </Typography>
                      <Typography>
                        <strong>Last Name:</strong> {contact.last_name || ""}
                      </Typography>
                      <Typography>
                        <strong>Middle Name:</strong>{" "}
                        {contact.middle_name || ""}
                      </Typography>
                      <Typography>
                        <strong>Phone:</strong> {contact.phone || ""}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {contact.email || ""}
                      </Typography>
                      <Typography>
                        <strong>Relationship:</strong>{" "}
                        {contact.relationship || ""}
                      </Typography>
                    </Box>
                  )}
                  {index < formData[fields].length - 1 && (
                    <hr style={{ margin: "16px 0" }} />
                  )}
                </Box>
              ))
            : fields.map(({ label, name, type, options }) => (
                <Box key={name} sx={{ marginBottom: 2 }}>
                  {isEditing ? (
                    type === "file" ? (
                      <Box>
                        <Typography variant="body2" sx={{ marginBottom: 1 }}>
                          Upload {label}:
                        </Typography>
                        <Button
                          variant="contained"
                          component="label"
                          sx={{ marginBottom: 1 }}
                        >
                          Choose File
                          <input
                            type="file"
                            name={name}
                            hidden
                            onChange={handleFileUpload}
                          />
                        </Button>
                        {uploadedProfilePicture &&
                          name === "profile_picture_url" && (
                            <Typography variant="body2">
                              Selected File: {uploadedProfilePicture}
                            </Typography>
                          )}
                        {uploadedDriverLicense &&
                          name === "driver_licence_url" && (
                            <Typography variant="body2">
                              Selected File: {uploadedDriverLicense}
                            </Typography>
                          )}
                        {uploadedWorkAuth && name === "work_auth_url" && (
                          <Typography variant="body2">
                            Selected File: {uploadedWorkAuth}
                          </Typography>
                        )}
                      </Box>
                    ) : type === "select" ? (
                      <Select
                        fullWidth
                        name={name}
                        value={
                          name.includes(".")
                            ? name
                                .split(".")
                                .reduce(
                                  (acc, key) => acc?.[key] || "",
                                  formData
                                )
                            : formData[name] || ""
                        }
                        onChange={handleChange}
                        displayEmpty
                      >
                        <MenuItem value="" disabled>
                          Select {label}
                        </MenuItem>
                        {options.map((option, index) => (
                          <MenuItem key={index} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : type === "date" ? (
                      <TextField
                        fullWidth
                        label={label}
                        name={name}
                        type="date"
                        value={
                          name.includes(".")
                            ? formatDate(
                                name
                                  .split(".")
                                  .reduce(
                                    (acc, key) => acc?.[key] || "",
                                    formData
                                  )
                              )
                            : formatDate(formData[name])
                        }
                        onChange={handleChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    ) : (
                      <TextField
                        fullWidth
                        label={label}
                        name={name}
                        value={
                          name.includes(".")
                            ? name
                                .split(".")
                                .reduce(
                                  (acc, key) => acc?.[key] || "",
                                  formData
                                )
                            : formData[name] || ""
                        }
                        onChange={handleChange}
                      />
                    )
                  ) : type === "file" && formData[name] ? (
                    <Typography>
                      <strong>{label}:</strong> {/* {formData[name]} */}
                      <a
                        href={formData[name]}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Preview
                      </a>
                      {" | "}
                      <a
                        href={formData[name]}
                        // download={true}
                        onClick={() => forceDownload(formData[name])}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download
                      </a>
                    </Typography>
                  ) : (
                    <Typography>
                      <strong>{label}:</strong>{" "}
                      {type === "date"
                        ? formatDate(
                            name.includes(".")
                              ? name
                                  .split(".")
                                  .reduce(
                                    (acc, key) => acc?.[key] || "",
                                    formData
                                  )
                              : formData[name]
                          )
                        : name.includes(".")
                        ? name
                            .split(".")
                            .reduce((acc, key) => acc?.[key] || "", formData)
                        : formData[name] || ""}
                    </Typography>
                  )}
                </Box>
              ))}
          <Box className="button-box">
            {isEditing ? (
              <div>
                <Button
                  variant="contained"
                  onClick={handleSaveClick}
                  sx={{ marginRight: 1 }}
                >
                  Save
                </Button>
                <Button variant="contained" onClick={handleCancelClick}>
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outlined"
                onClick={() => handleEditClick(sectionName)}
              >
                Edit
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    );
  };

  return (
    <Box sx={{ maxWidth: 500, margin: "0 auto" }}>
      <Typography
        variant="h4"
        className="section-header"
        sx={{ marginTop: 10 }}
      >
        Personal Profile
      </Typography>
      {renderSection("Name", [
        { label: "First Name", name: "first_name" },
        { label: "Last Name", name: "last_name" },
        { label: "Middle Name", name: "middle_name" },
        { label: "Preferred Name", name: "preferred_name" },
        { label: "Profile Pic", name: "profile_picture_url", type: "file" },
        { label: "Email", name: "email" },
        { label: "SSN", name: "ssn" },
        { label: "Date of Birth", name: "dob", type: "date" },
        { label: "Gender", name: "gender", type: "select", options: genders },
      ])}
      {renderSection("Address", [
        { label: "Building", name: "current_address.building" },
        { label: "Street", name: "current_address.street" },
        { label: "City", name: "current_address.city" },
        { label: "State", name: "current_address.state" },
        { label: "Zipcode", name: "current_address.zip" },
      ])}
      {renderSection("Contact Information", [
        { label: "Cell Phone", name: "cell_phone" },
        { label: "Work Phone", name: "work_phone" },
      ])}
      {renderSection("Employment", [
        {
          label: "Visa Title",
          name: "visa_type",
          type: "select",
          options: visaTypes,
        },
        { label: "Start Date", name: "visa_start_date", type: "date" },
        { label: "End Date", name: "visa_end_date", type: "date" },
      ])}
      {renderSection("Emergency Contacts", "emergency_contacts", true)}
      {renderSection("Documents", [
        { label: "Driver License", name: "driver_licence_url", type: "file" },
        { label: "Work Authorization", name: "work_auth_url", type: "file" },
        // { label: "Additional Documents", name: "additional_url", type: "file" },
      ])}
    </Box>
  );
};

export default PersonalProfile;

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchEmployeeProfile,
  updateEmployeeProfile,
} from "../../store/employeeSlice/employee.slice";

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
  // const userId = useSelector((state) => state.employee.profile.user_id);
  const userId = "6787f9cc12031eef1f9f6852";

  useEffect(() => {
    dispatch(fetchEmployeeProfile(userId));
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  if (status === "loading") return <p>Loading...</p>;
  if (status === "failed") return <p>Error: {error}</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleEditClick = (section) => {
    setEditingSection(section);
  };

  const handleSaveClick = () => {
    try {
      dispatch(updateEmployeeProfile(formData));
      setEditingSection(null);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleCancelClick = () => {
    setFormData(profile);
    setEditingSection(null);
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
                        <strong>First Name*:</strong> {contact.first_name || ""}
                      </Typography>
                      <Typography>
                        <strong>Last Name*:</strong> {contact.last_name || ""}
                      </Typography>
                      <Typography>
                        <strong>Phone*:</strong> {contact.phone || ""}
                      </Typography>
                      <Typography>
                        <strong>Email*:</strong> {contact.email || ""}
                      </Typography>
                      <Typography>
                        <strong>Relationship*:</strong>{" "}
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
                    type === "select" ? (
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
                  ) : (
                    <Typography>
                      <strong>{label}:</strong>{" "}
                      {name.includes(".")
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
        { label: "First Name*", name: "first_name" },
        { label: "Last Name*", name: "last_name" },
        { label: "Middle Name", name: "middle_name" },
        { label: "Preferred Name", name: "preferred_name" },
        { label: "Profile Pic", name: "profile_picture_url" },
        { label: "SSN*", name: "ssn" },
        { label: "Date of Birth*", name: "dob", type: "date" },
        { label: "Gender", name: "gender", type: "select", options: genders },
      ])}
      {renderSection("Address*", [
        { label: "Building", name: "current_address.building" },
        { label: "Street", name: "current_address.street" },
        { label: "City", name: "current_address.city" },
        { label: "State", name: "current_address.state" },
        { label: "Zipcode", name: "current_address.zip" },
      ])}
      {renderSection("Contact Information", [
        { label: "Cell Phone*", name: "cell_phone" },
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
        { label: "Driver License*", name: "driver_licence_url" },
        { label: "Work Authorization", name: "work_auth_url" },
        { label: "Additional Documents", name: "additional_url" },
      ])}
    </Box>
  );
};

export default PersonalProfile;

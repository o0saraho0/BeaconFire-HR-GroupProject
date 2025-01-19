import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../interceptors/auth.interceptor";
import {
  setDocumentKey,
  selectUserDocuments,
} from "../../store/documentSlice/documentSlice";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
  Paper,
  Pagination,
} from "@mui/material";
import { Grid2 as Grid } from "@mui/material";

const Application = () => {
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const [status, setStatus] = useState("Not Started");
  const userDocuments = useSelector((state) =>
    selectUserDocuments(state, userId)
  );
  const [feedback, setFeedback] = useState("");
  const localHost = "localhost:3000";
  const [uploadedProfilePicture, setProfilePicture] = useState("");
  const [uploadedDriverLicense, setDriverLicense] = useState("");
  const [uploadedWorkAuth, setWorkAuth] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

  const validations = {
    name: {
      pattern: /^[A-Za-z\s-']+$/,
      message: "Only letters, spaces, hyphens, and apostrophes allowed",
    },
    phone: {
      pattern: /^\d{10}$/,
      message: "Must be exactly 10 digits",
    },
    ssn: {
      pattern: /^\d{9}$/,
      message: "Must be exactly 9 digits",
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Must be a valid email address",
    },
    address: {
      pattern: /^[A-Za-z0-9\s,.-]+$/,
      message: "Letters, numbers, and basic punctuation only",
    },
    zip: {
      pattern: /^\d{5}$/,
      message: "Must be exactly 5 digits",
    },
    relationship: {
      pattern: /^[A-Za-z\s-]+$/,
      message: "Letters, spaces, and hyphens only",
    },
  };

  const getValidationProps = (fieldName, value) => {
    let validation = null;

    if (
      fieldName.includes("firstName") ||
      fieldName.includes("lastName") ||
      fieldName.includes("middleName") ||
      fieldName.includes("preferredName")
    ) {
      validation = validations.name;
    } else if (fieldName.includes("phone")) {
      validation = validations.phone;
    } else if (fieldName === "ssn") {
      validation = validations.ssn;
    } else if (fieldName.includes("email")) {
      validation = validations.email;
    } else if (
      fieldName.includes("building") ||
      fieldName.includes("street") ||
      fieldName.includes("city") ||
      fieldName.includes("state")
    ) {
      validation = validations.address;
    } else if (fieldName.includes("zip")) {
      validation = validations.zip;
    } else if (fieldName.includes("relationship")) {
      validation = validations.relationship;
    }
    if (!validation || !value) return {};

    const isValid = validation.pattern.test(value);
    return {
      error: value !== "" && !isValid,
      helperText: value !== "" && !isValid ? validation.message : "",
    };
  };

  const mapBackendToFrontend = (backendData) => {
    return {
      firstName: backendData.first_name || "",
      lastName: backendData.last_name || "",
      middleName: backendData.middle_name || "",
      preferredName: backendData.preferred_name || "",
      profilePicture: backendData.profile_picture_url || "",
      currentAddress: {
        building: backendData.current_address.building || "",
        street: backendData.current_address.street || "",
        city: backendData.current_address.city || "",
        state: backendData.current_address.state || "",
        zip: backendData.current_address.zip || "",
      },
      cellPhone: backendData.cell_phone || "",
      workPhone: backendData.work_phone || "",
      carInfo: {
        make: backendData.car_make || "",
        model: backendData.car_model || "",
        color: backendData.car_color || "",
      },
      email: backendData.email || "",
      ssn: backendData.ssn || "",
      dob: backendData.dob || "",
      gender: backendData.gender || "",
      citizenOrResident:
        backendData.visa_type === "Green Card" ||
        backendData.visa_type === "Citizen"
          ? "Yes"
          : "No",
      visaType: backendData.visa_type || "",
      visaStartDate: backendData.visa_start_date || "",
      visaEndDate: backendData.visa_end_date || "",
      driverLicense: {
        number: backendData.driver_licence_number || "",
        expireDate: backendData.driver_license_expire_date || "",
      },
      reference: {
        firstName: backendData.reference.first_name || "",
        lastName: backendData.reference.last_name || "",
        middleName: backendData.reference.middle_name || "",
        phone: backendData.reference.phone || "",
        email: backendData.reference.email || "",
        relationship: backendData.reference.relationship || "",
      },
      emergencyContacts:
        backendData.emergency_contacts.map((contact) => ({
          firstName: contact.first_name || "",
          lastName: contact.last_name || "",
          phone: contact.phone || "",
          email: contact.email || "",
          relationship: contact.relationship || "",
        })) || [],
      uploadedFiles: {
        driverLicense: backendData.driver_license_url || "",
        workAuthorization: backendData.work_auth_url || "",
      },
      hasDriverLicense: !!backendData.driver_licence_number || false,
      visaTitle: backendData.visa_title || "",
    };
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    preferredName: "",
    profilePicture: "",
    currentAddress: {
      building: "",
      street: "",
      city: "",
      state: "",
      zip: "",
    },
    cellPhone: "",
    workPhone: "",
    carInfo: {
      make: "",
      model: "",
      color: "",
    },
    email: "",
    ssn: "",
    dob: "",
    gender: "",
    citizenOrResident: "",
    visaType: "",
    visaStartDate: "",
    visaEndDate: "",
    driverLicense: {
      number: "",
      expireDate: "",
    },
    reference: {
      firstName: "",
      lastName: "",
      middleName: "",
      phone: "",
      email: "",
      relationship: "",
    },
    emergencyContacts: [],
    uploadedFiles: {
      driverLicense: "",
      workAuthorization: "",
    },
    hasDriverLicense: false,
    visaTitle: "",
  });

  const [page, setPage] = useState(1);
  const totalPages = 3;

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(
          `http://${localHost}/api/onboarding/status`
        );
        console.log(response.data);
        if (response.data.status == "Not Started") {
          setStatus(response.data.status);
        } else {
          const mappedData = mapBackendToFrontend(response.data.application);
          setStatus(response.data.application.status);
          setFeedback(response.data.application.feedback);
          setFormData(mappedData);
          console.log(
            "formdata after getting respone from onboarding",
            formData
          );
        }
        console.log(response.data.email);
        setFormData((prevData) => ({
          ...prevData,
          email: response.data.email,
        }));
      } catch (error) {
        console.error("Error fetching application:", error);
      }
    };

    fetchApplication();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(/[\.\[\]]+/).filter(Boolean);

    setFormData((prevState) => {
      let newState = { ...prevState };
      let current = newState;

      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current)) {
          current = current[parseInt(keys[i], 10)];
        } else {
          current = current[keys[i]];
        }
      }

      const finalKey = keys[keys.length - 1];
      if (Array.isArray(current)) {
        current[parseInt(finalKey, 10)] = value;
      } else {
        if (finalKey.includes("Date")) {
          current[finalKey] = new Date(value).toISOString().split("T")[0];
        } else {
          current[finalKey] = value;
        }
      }

      return newState;
    });
  };
  console.log("has driver license", formData.hasDriverLicense);
  console.log("ssn number", formData.ssn);
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const fileName = file.name;
    switch (e.target.name) {
      case "profilePicture":
        setProfilePicture(fileName);
        break;
      case "driversLicenseFile":
        setDriverLicense(fileName);
        break;
      case "workAuthorizationFile":
        setWorkAuth(fileName);
        break;
      default:
        return;
    }
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    let endpoint = "";
    switch (e.target.name) {
      case "profilePicture":
        endpoint = "/api/upload/profile-picture";
        break;
      case "driversLicenseFile":
        endpoint = "/api/upload/driver-license";
        break;
      case "workAuthorizationFile":
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
      dispatch(
        setDocumentKey({
          userId,
          documentType: e.target.name,
          key: response.data.key,
        })
      );
      console.log("userDocuments", userDocuments);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    //   // Check if all required fields are filled
    const requiredFields = [
      "firstName",
      "lastName",
      "cellPhone",
      "ssn",
      "dob",
      "visaType",
      "hasDriverLicense",
      "emergencyContacts",
    ];

    for (const field of requiredFields) {
      let value = formData;

      value = value[field];
      if (value === undefined || value === "") {
        alert("Missing required field", field);
        return;
      }
    }

    try {
      const response = await axios.post(
        `http://${localHost}/api/onboarding`,
        formData
      );
      alert(
        "Application successfully submitted. Please wait for approval from HR."
      );
    } catch (error) {
      console.error("Error submitting application:", error);
    }
  };

  const renderFormPage1 = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Middle Name"
          name="middleName"
          value={formData.middleName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Preferred Name"
          name="preferredName"
          value={formData.preferredName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Cell Phone"
          name="cellPhone"
          placeholder="Cell Phone"
          value={formData.cellPhone}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Work Phone"
          name="workPhone"
          placeholder="Work Phone"
          value={formData.workPhone}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Button
          variant="contained"
          component="label"
          style={{ marginTop: "16px", marginBottom: "16px" }}
        >
          Upload Profile Picture
          <input
            type="file"
            name="profilePicture"
            placeholder="Profile Picture"
            onChange={handleFileUpload}
            hidden
          />
        </Button>
        {uploadedProfilePicture && (
          <Typography variant="body2" style={{ marginTop: "8px" }}>
            {uploadedProfilePicture}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Current Address
        </Typography>
        <TextField
          label="Building/Apt #"
          name="currentAddress.building"
          placeholder="Building/Apt #"
          value={formData.currentAddress.building}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Street Name"
          name="currentAddress.street"
          placeholder="Street Name"
          value={formData.currentAddress.street}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="City"
          name="currentAddress.city"
          placeholder="City"
          value={formData.currentAddress.city}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="State"
          name="currentAddress.state"
          placeholder="State"
          value={formData.currentAddress.state}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Zip"
          name="currentAddress.zip"
          placeholder="Zip"
          value={formData.currentAddress.zip}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
      </Grid>
    </Grid>
  );

  const renderFormPage2 = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Car Information
        </Typography>
        <TextField
          label="Make"
          name="carInfo.make"
          placeholder="Make"
          value={formData.carInfo.make}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Model"
          name="carInfo.model"
          placeholder="Model"
          value={formData.carInfo.model}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Color"
          name="carInfo.color"
          placeholder="Color"
          value={formData.carInfo.color}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Additional Information
        </Typography>
        <TextField
          label="Email"
          name="email"
          value={formData.email}
          fullWidth
          disabled
          margin="normal"
        />
        <TextField
          label="SSN"
          name="ssn"
          value={formData.ssn}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
          sx={{
            "& .MuiInputLabel-root": {
              transform: "translate(14px, -9px) scale(0.75)",
            },
          }}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="I do not wish to answer">
              I do not wish to answer
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel required>
            Are you a citizen or permanent resident of the U.S?
          </InputLabel>
          <Select
            name="citizenOrResident"
            value={formData.citizenOrResident}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="Yes">Yes</MenuItem>
            <MenuItem value="No">No</MenuItem>
          </Select>
        </FormControl>

        {formData.citizenOrResident === "Yes" && (
          <FormControl fullWidth margin="normal">
            <InputLabel>Choose your status</InputLabel>
            <Select
              name="visaType"
              value={formData.visaType}
              onChange={(e) => {
                // Clear any existing non-citizen visa values when switching to citizen status
                setFormData((prev) => ({
                  ...prev,
                  visaType: e.target.value,
                  visaTitle: "",
                  visaStartDate: "",
                  visaEndDate: "",
                }));
              }}
              required
            >
              <MenuItem value="Green Card">Green Card</MenuItem>
              <MenuItem value="Citizen">Citizen</MenuItem>
            </Select>
          </FormControl>
        )}

        {formData.citizenOrResident === "No" && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel required>What is your work authorization?</InputLabel>
              <Select
                name="visaType"
                value={formData.visaType}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    visaType: e.target.value,
                    visaTitle: "",
                    visaStartDate: "",
                    visaEndDate: "",
                  }));
                }}
                required
              >
                <MenuItem value="H1B">H1-B</MenuItem>
                <MenuItem value="L2">L2</MenuItem>
                <MenuItem value="F1">F1 (CPT/OPT)</MenuItem>
                <MenuItem value="H4">H4</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </Select>
            </FormControl>

            {formData.visaType === "F1" && (
              <Button
                variant="contained"
                component="label"
                style={{ marginTop: "16px", marginBottom: "16px" }}
              >
                Upload OPT Receipt
                <input
                  type="file"
                  name="workAuthorizationFile"
                  onChange={handleFileUpload}
                  hidden
                />
              </Button>
            )}

            {formData.visaType === "Other" && (
              <TextField
                label="Specify Visa Title"
                name="visaTitle"
                value={formData.visaTitle}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            )}

            <TextField
              label="Visa Start Date"
              name="visaStartDate"
              type="date"
              value={formData.visaStartDate}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiInputLabel-root": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
            />

            <TextField
              label="Visa End Date"
              name="visaEndDate"
              type="date"
              value={formData.visaEndDate}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
              sx={{
                "& .MuiInputLabel-root": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
            />
          </>
        )}
        {uploadedWorkAuth && (
          <Typography variant="body2" style={{ marginTop: "8px" }}>
            {uploadedWorkAuth}
          </Typography>
        )}
        <FormControlLabel
          control={
            <Checkbox
              name="hasDriverLicense"
              checked={formData.hasDriverLicense}
              onChange={(e) =>
                handleInputChange({
                  target: { name: "hasDriverLicense", value: e.target.checked },
                })
              }
              required
            />
          }
          label="Do you have a driver's license?"
          style={{ marginTop: "16px", marginBottom: "16px" }}
        />
        {formData.hasDriverLicense && (
          <>
            <TextField
              label="Driver's License Number"
              name="driverLicense.number"
              value={formData.driverLicense.number}
              onChange={handleInputChange}
              fullWidth
              required
              margin="normal"
            />
            <TextField
              label="Expiration Date"
              name="driverLicense.expireDate"
              type="date"
              value={formData.driverLicense.expireDate}
              onChange={handleInputChange}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": {
                  transform: "translate(14px, -9px) scale(0.75)",
                },
              }}
              required
              margin="normal"
            />
            <Button
              variant="contained"
              component="label"
              style={{ marginTop: "16px", marginBottom: "16px" }}
            >
              Upload Driver's License
              <input
                type="file"
                name="driversLicenseFile"
                onChange={handleFileUpload}
                hidden
              />
            </Button>
            {uploadedDriverLicense && (
              <Typography variant="body2" style={{ marginTop: "8px" }}>
                {uploadedDriverLicense}
              </Typography>
            )}
          </>
        )}
      </Grid>
    </Grid>
  );

  const renderFormPage3 = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Reference (who referred you to this company? There can only be 1)
        </Typography>
        <TextField
          label="First Name"
          name="reference.firstName"
          placeholder="First Name"
          value={formData.reference.firstName}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Last Name"
          name="reference.lastName"
          placeholder="Last Name"
          value={formData.reference.lastName}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Middle Name"
          name="reference.middleName"
          placeholder="Middle Name"
          value={formData.reference.middleName}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Phone"
          name="reference.phone"
          placeholder="Phone"
          value={formData.reference.phone}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Email"
          name="reference.email"
          placeholder="Email"
          value={formData.reference.email}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="Relationship"
          name="reference.relationship"
          placeholder="Relationship"
          value={formData.reference.relationship}
          onChange={handleInputChange}
          fullWidth
          required
          margin="normal"
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Emergency Contacts
        </Typography>
        {formData.emergencyContacts.length === 0 &&
          setFormData({
            ...formData,
            emergencyContacts: [
              {
                firstName: "",
                lastName: "",
                middleName: "",
                phone: "",
                email: "",
                relationship: "",
              },
            ],
          })}
        {formData.emergencyContacts.map((contact, index) => (
          <Grid container spacing={3} key={index}>
            <Grid item xs={12}>
              <TextField
                label="First Name"
                name={`emergencyContacts[${index}].firstName`}
                placeholder="First Name"
                value={contact.firstName}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Last Name"
                name={`emergencyContacts[${index}].lastName`}
                placeholder="Last Name"
                value={contact.lastName}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Middle Name"
                name={`emergencyContacts[${index}].middleName`}
                placeholder="Middle Name"
                value={contact.middleName}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone"
                name={`emergencyContacts[${index}].phone`}
                placeholder="Phone"
                value={contact.phone}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Email"
                name={`emergencyContacts[${index}].email`}
                placeholder="Email"
                value={contact.email}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
              <TextField
                label="Relationship"
                name={`emergencyContacts[${index}].relationship`}
                placeholder="Relationship"
                value={contact.relationship}
                onChange={handleInputChange}
                fullWidth
                required
                margin="normal"
              />
            </Grid>
          </Grid>
        ))}
        <Button
          variant="contained"
          onClick={() =>
            setFormData({
              ...formData,
              emergencyContacts: [
                ...formData.emergencyContacts,
                {
                  firstName: "",
                  lastName: "",
                  middleName: "",
                  phone: "",
                  email: "",
                  relationship: "",
                },
              ],
            })
          }
          style={{ marginTop: "16px", marginBottom: "16px" }}
        >
          Add Emergency Contact
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6" gutterBottom>
          Summary of Uploaded Files
        </Typography>
        <ul>
          {formData.profilePicture && (
            <li>
              <div>
                <a
                  href={formData.profilePicture}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview Profile Picture
                </a>
              </div>
              <div>
                <a
                  href="#"
                  onClick={() => forceDownload(formData.profilePicture)}
                >
                  Download Profile Picture
                </a>
              </div>
            </li>
          )}
          {formData.uploadedFiles.driverLicense && (
            <li>
              <div>
                <a
                  href={formData.uploadedFiles.driverLicense}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview Driver's License
                </a>
              </div>
              <div>
                <a
                  href="#"
                  onClick={() =>
                    forceDownload(formData.uploadedFiles.driverLicense)
                  }
                >
                  Download Driver's License
                </a>
              </div>
            </li>
          )}
          {formData.uploadedFiles.workAuthorization && (
            <li>
              <div>
                <a
                  href={formData.uploadedFiles.workAuthorization}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Preview Work Authorization
                </a>
              </div>
              <div>
                <a
                  href="#"
                  onClick={() =>
                    forceDownload(formData.uploadedFiles.workAuthorization)
                  }
                >
                  Download Work Authorization
                </a>
              </div>
            </li>
          )}
        </ul>
      </Grid>
    </Grid>
  );

  const renderForm = () => {
    switch (page) {
      case 1:
        return renderFormPage1();
      case 2:
        return renderFormPage2();
      case 3:
        return renderFormPage3();
      default:
        return null;
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

  const renderPendingMessage = () => (
    <Paper elevation={3} style={{ padding: "20px", marginTop: "20px" }}>
      <Typography variant="h4">
        Please wait for HR to review your application. Below is your submitted
        application and uploaded documents:
      </Typography>
      <Typography variant="h6">Submitted Application</Typography>
      <Typography variant="body2">
        <strong>First Name:</strong> {formData.firstName}
      </Typography>
      <Typography variant="body2">
        <strong>Last Name:</strong> {formData.lastName}
      </Typography>
      <Typography variant="body2">
        <strong>Middle Name:</strong> {formData.middleName}
      </Typography>
      <Typography variant="body2">
        <strong>Preferred Name:</strong> {formData.preferredName}
      </Typography>
      <Typography variant="body2">
        <strong>Email:</strong> {formData.email}
      </Typography>
      <Typography variant="body2">
        <strong>Cell Phone:</strong> {formData.cellPhone}
      </Typography>
      <Typography variant="body2">
        <strong>Work Phone:</strong> {formData.workPhone}
      </Typography>
      <Typography variant="body2">
        <strong>Current Address:</strong>{" "}
        {`${formData.currentAddress.building}, ${formData.currentAddress.street}, ${formData.currentAddress.city}, ${formData.currentAddress.state}, ${formData.currentAddress.zip}`}
      </Typography>
      <Typography variant="body2">
        <strong>Car Information:</strong>{" "}
        {`${formData.carInfo.make}, ${formData.carInfo.model}, ${formData.carInfo.color}`}
      </Typography>
      <Typography variant="body2">
        <strong>SSN:</strong> {formData.ssn}
      </Typography>
      <Typography variant="body2">
        <strong>Date of Birth:</strong> {formData.dob}
      </Typography>
      <Typography variant="body2">
        <strong>Gender:</strong> {formData.gender}
      </Typography>
      <Typography variant="body2">
        <strong>Citizen or Resident:</strong> {formData.citizenOrResident}
      </Typography>
      <Typography variant="body2">
        <strong>Visa Type:</strong> {formData.visaType}
      </Typography>
      <Typography variant="body2">
        <strong>Visa Start Date:</strong> {formData.visaStartDate}
      </Typography>
      <Typography variant="body2">
        <strong>Visa End Date:</strong> {formData.visaEndDate}
      </Typography>
      {formData.visaType === "Other" && (
        <Typography variant="body2">
          <strong>Visa Title:</strong> {formData.visaTitle}
        </Typography>
      )}
      {formData.hasDriverLicense && (
        <>
          <Typography variant="body2">
            <strong>Driver's License Number:</strong>{" "}
            {formData.driverLicense.number}
          </Typography>
          <Typography variant="body2">
            <strong>Expiration Date:</strong>{" "}
            {formData.driverLicense.expireDate}
          </Typography>
        </>
      )}
      <Typography variant="body2">
        <strong>Reference:</strong>{" "}
        {`${formData.reference.firstName} ${formData.reference.middleName} ${formData.reference.lastName}, ${formData.reference.phone}, ${formData.reference.email}, ${formData.reference.relationship}`}
      </Typography>
      <Typography variant="body2">
        <strong>Emergency Contacts:</strong>{" "}
        {formData.emergencyContacts.map((contact, index) => (
          <div
            key={index}
          >{`${contact.firstName} ${contact.lastName}, ${contact.phone}, ${contact.email}, ${contact.relationship}`}</div>
        ))}
      </Typography>

      <Typography variant="h6">Uploaded Documents</Typography>
      <ul>
        {formData.profilePicture && (
          <li>
            <div>
              <a
                href={formData.profilePicture}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview Profile Picture
              </a>
            </div>
            <div>
              <a
                href="#"
                onClick={() => forceDownload(formData.profilePicture)}
              >
                Download Profile Picture
              </a>
            </div>
          </li>
        )}
        {formData.uploadedFiles.driverLicense && (
          <li>
            <div>
              <a
                href={formData.uploadedFiles.driverLicense}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview Driver's License
              </a>
            </div>
            <div>
              <a
                href="#"
                onClick={() =>
                  forceDownload(formData.uploadedFiles.driverLicense)
                }
              >
                Download Driver's License
              </a>
            </div>
          </li>
        )}
        {formData.uploadedFiles.workAuthorization && (
          <li>
            <div>
              <a
                href={formData.uploadedFiles.workAuthorization}
                target="_blank"
                rel="noopener noreferrer"
              >
                Preview Work Authorization
              </a>
            </div>
            <div>
              <a
                href="#"
                onClick={() =>
                  forceDownload(formData.uploadedFiles.workAuthorization)
                }
              >
                Download Work Authorization
              </a>
            </div>
          </li>
        )}
      </ul>
    </Paper>
  );

  const renderContent = () => {
    switch (status) {
      case "Not Started":
      case "Rejected":
        return (
          <form onSubmit={handleSubmit}>
            {status === "Rejected" && (
              <Typography variant="body1">
                Your application was rejected. Feedback: {feedback} Please make
                changes on the application and resubmit it for review. Thank
                you.
              </Typography>
            )}
            {renderForm()}
            <Grid item xs={12}>
              {page < totalPages ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="contained" color="primary">
                  {status === "Rejected" ? "Resubmit" : "Submit"}
                </Button>
              )}
            </Grid>
          </form>
        );
      case "Pending":
        return renderPendingMessage();
      case "Approved":
        window.location.href = "/index.html";
        return null;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Onboarding Application
      </Typography>
      {renderContent()}
      {status !== "Pending" && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={(event, value) => setPage(value)}
          color="primary"
          style={{ marginTop: "20px" }}
        />
      )}
    </Container>
  );
};

export default Application;

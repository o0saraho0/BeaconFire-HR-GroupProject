import { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { fetchEmployeeProfile } from "../../store/employeeSlice/employee.slice";

import { Button, TextField, Box, Typography, Paper } from "@mui/material";
import "./PersonalProfile.css";

const PersonalProfile = () => {
  const [editingSection, setEditingSection] = useState(null);
  const [formData, setFormData] = useState({
    first_name: "John",
    last_name: "Doe",
    address: {
      building: "101",
      street: "Main St",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
    },
    cell_phone: "123-456-7890",
    dob: new Date("1990-01-01"),
    gender: "Male",
    car_make: "Toyota",
    car_model: "Corolla",
    car_color: "Blue",
    ssn: "123456789",
    visa_type: "H1B Category",
    reference: {
      first_name: "Alice",
      last_name: "Smith",
      phone: "9876543210",
      email: "alice.smith@example.com",
      relationship: "Manager",
    },
    emergency_contacts: [
      {
        first_name: "Alice",
        last_name: "Smith",
        phone: "9876543210",
        email: "alice.smith@example.com",
        relationship: "Manager",
      },
      {
        first_name: "Alice",
        last_name: "Smith",
        phone: "9876543210",
        email: "alice.smith@example.com",
        relationship: "Manager",
      },
    ],
  });

  // const dispatch = useDispatch();
  // const { profile, status, error } = useSelector((state) => state.employee);
  // // const userId = useSelector((state) => state.user.id);
  // const userId = "6785ad9b7f4c40a6ad6bb571";

  // useEffect(() => {
  //   if (userId) {
  //     dispatch(fetchEmployeeProfile(userId));
  //   }
  // }, [userId, dispatch]);

  // useEffect(() => {
  //   console.log("Profile fetched from Redux store:", profile);
  //   if (profile) {
  //     setFormData(profile);
  //   }
  // }, [profile]);

  // if (status === "loading") return <p>Loading...</p>;
  // if (status === "failed") return <p>Error: {error}</p>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const keys = name.split(".");
      setFormData((prevState) => {
        const newFormData = { ...prevState };
        let nestedField = newFormData;
        for (let i = 0; i < keys.length - 1; i++) {
          nestedField = nestedField[keys[i]];
        }
        nestedField[keys[keys.length - 1]] = value;
        return newFormData;
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleEditClick = (section) => {
    setEditingSection(section);
  };

  const handleSaveClick = () => {
    // logic here to fetchupdate
    setEditingSection(null);
  };

  const renderSection = (sectionName, fields, isArray = false) => {
    const isEditing = editingSection === sectionName;

    return (
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
        <Box>
          <Typography variant="h6" className="section-header">
            {sectionName}
          </Typography>
          {isArray
            ? formData[fields].map((contact, index) => (
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
                        value={contact[key]}
                        onChange={handleChange}
                        sx={{ marginBottom: 1 }}
                      />
                    ))
                  ) : (
                    <Box>
                      <Typography>
                        <strong>First Name:</strong> {contact.first_name}
                      </Typography>
                      <Typography>
                        <strong>Last Name:</strong> {contact.last_name}
                      </Typography>
                      <Typography>
                        <strong>Phone:</strong> {contact.phone}
                      </Typography>
                      <Typography>
                        <strong>Email:</strong> {contact.email}
                      </Typography>
                      <Typography>
                        <strong>Relationship:</strong> {contact.relationship}
                      </Typography>
                    </Box>
                  )}
                  {index < formData[fields].length - 1 && (
                    <hr style={{ margin: "16px 0" }} />
                  )}
                </Box>
              ))
            : fields.map(({ label, name }) => (
                <Box key={name} sx={{ marginBottom: 2 }}>
                  {isEditing ? (
                    <TextField
                      fullWidth
                      label={label}
                      name={name}
                      value={
                        name.includes(".")
                          ? name
                              .split(".")
                              .reduce((acc, key) => acc[key], formData)
                          : formData[name]
                      }
                      onChange={handleChange}
                    />
                  ) : (
                    <Typography>
                      <strong>{label}:</strong>{" "}
                      {name.includes(".")
                        ? name
                            .split(".")
                            .reduce((acc, key) => acc[key], formData)
                        : formData[name]}
                    </Typography>
                  )}
                </Box>
              ))}
          <Box className="button-box">
            {isEditing ? (
              <Button
                variant="contained"
                onClick={handleSaveClick}
                sx={{ marginRight: 1 }}
              >
                Save
              </Button>
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
      <Typography variant="h4" className="section-header">
        Personal Profile
      </Typography>
      {renderSection("Name", [
        { label: "First Name", name: "first_name" },
        { label: "Last Name", name: "last_name" },
      ])}
      {renderSection("Address", [
        { label: "Building", name: "address.building" },
        { label: "Street", name: "address.street" },
        { label: "City", name: "address.city" },
        { label: "State", name: "address.state" },
        { label: "ZIP", name: "address.zip" },
      ])}
      {renderSection("Reference", [
        { label: "First Name", name: "reference.first_name" },
        { label: "Last Name", name: "reference.last_name" },
        { label: "Phone", name: "reference.phone" },
        { label: "Email", name: "reference.email" },
        { label: "Relationship", name: "reference.relationship" },
      ])}
      {renderSection("Emergency Contacts", "emergency_contacts", true)}
    </Box>
  );
};

export default PersonalProfile;

import React, { useState } from "react";

const PersonalProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    middleName: "",
    preferredName: "",
    // Add other fields as needed
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    // Reset form data or handle as needed
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    // Save form data logic
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <div>
      <h2>Personal Information</h2>
      <div>
        <h3>Name</h3>
        {isEditing ? (
          <div>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            {/* Add other input fields as needed */}
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        ) : (
          <div>
            <p>First Name: {formData.firstName}</p>
            <p>Last Name: {formData.lastName}</p>
            {/* Display other fields as needed */}
            <button onClick={handleEditClick}>Edit</button>
          </div>
        )}
      </div>
      {/* Repeat similar structure for other sections */}
    </div>
  );
};

export default PersonalProfile;

import { useState } from "react";

const PersonalProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
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
    ],
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    // Save form data logic
    setIsEditing(false);
  };

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

  return (
    <div>
      <h2>Personal Information</h2>
      {/* Name Section */}
      <div>
        <h3>Name</h3>
        {isEditing ? (
          <div>
            <label>
              First Name:
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </label>
          </div>
        ) : (
          <div>
            <p>First Name: {formData.first_name}</p>
            <p>Last Name: {formData.last_name}</p>
          </div>
        )}
      </div>

      {/* Address Section */}
      <div>
        <h3>Address</h3>
        {isEditing ? (
          <div>
            <label>
              Building:
              <input
                type="text"
                name="address.building"
                value={formData.address.building}
                onChange={handleChange}
              />
            </label>
            <label>
              Street:
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
              />
            </label>
            <label>
              City:
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
              />
            </label>
            <label>
              State:
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
              />
            </label>
            <label>
              ZIP:
              <input
                type="text"
                name="address.zip"
                value={formData.address.zip}
                onChange={handleChange}
              />
            </label>
          </div>
        ) : (
          <div>
            <p>Building: {formData.address.building}</p>
            <p>Street: {formData.address.street}</p>
            <p>City: {formData.address.city}</p>
            <p>State: {formData.address.state}</p>
            <p>ZIP: {formData.address.zip}</p>
          </div>
        )}
      </div>

      {/* Reference Section */}
      <div>
        <h3>Reference</h3>
        {isEditing ? (
          <div>
            <label>
              First Name:
              <input
                type="text"
                name="reference.first_name"
                value={formData.reference.first_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Last Name:
              <input
                type="text"
                name="reference.last_name"
                value={formData.reference.last_name}
                onChange={handleChange}
              />
            </label>
            <label>
              Phone:
              <input
                type="text"
                name="reference.phone"
                value={formData.reference.phone}
                onChange={handleChange}
              />
            </label>
            <label>
              Email:
              <input
                type="email"
                name="reference.email"
                value={formData.reference.email}
                onChange={handleChange}
              />
            </label>
            <label>
              Relationship:
              <input
                type="text"
                name="reference.relationship"
                value={formData.reference.relationship}
                onChange={handleChange}
              />
            </label>
          </div>
        ) : (
          <div>
            <p>First Name: {formData.reference.first_name}</p>
            <p>Last Name: {formData.reference.last_name}</p>
            <p>Phone: {formData.reference.phone}</p>
            <p>Email: {formData.reference.email}</p>
            <p>Relationship: {formData.reference.relationship}</p>
          </div>
        )}
      </div>

      {/* Emergency Contacts */}
      <div>
        <h3>Emergency Contacts</h3>
        {formData.emergency_contacts.map((contact, index) => (
          <div key={index}>
            {isEditing ? (
              <div>
                <label>
                  First Name:
                  <input
                    type="text"
                    name={`emergency_contacts.${index}.first_name`}
                    value={contact.first_name}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Last Name:
                  <input
                    type="text"
                    name={`emergency_contacts.${index}.last_name`}
                    value={contact.last_name}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    name={`emergency_contacts.${index}.phone`}
                    value={contact.phone}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    name={`emergency_contacts.${index}.email`}
                    value={contact.email}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Relationship:
                  <input
                    type="text"
                    name={`emergency_contacts.${index}.relationship`}
                    value={contact.relationship}
                    onChange={handleChange}
                  />
                </label>
              </div>
            ) : (
              <div>
                <p>First Name: {contact.first_name}</p>
                <p>Last Name: {contact.last_name}</p>
                <p>Phone: {contact.phone}</p>
                <p>Email: {contact.email}</p>
                <p>Relationship: {contact.relationship}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      {isEditing ? (
        <div>
          <button onClick={handleSaveClick}>Save</button>
          <button onClick={handleCancelClick}>Cancel</button>
        </div>
      ) : (
        <button onClick={handleEditClick}>Edit</button>
      )}
    </div>
  );
};

export default PersonalProfile;

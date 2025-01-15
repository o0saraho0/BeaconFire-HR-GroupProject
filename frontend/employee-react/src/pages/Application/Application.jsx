import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Application = () => {
  const [application, setApplication] = useState(null);
  const [status, setStatus] = useState('Not Started');
  const [feedback, setFeedback] = useState('');
  const localHost = 'localhost:3000'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    preferredName: '',
    profilePicture: '',
    currentAddress: {
      building: '',
      street: '',
      city: '',
      state: '',
      zip: '',
    },
    cellPhone: '',
    workPhone: '',
    carInfo: {
      make: '',
      model: '',
      color: '',
    },
    email: '',
    ssn: '',
    dob: '',
    gender: '',
    visaType: '',
    visaStartDate: '',
    visaEndDate: '',
    driverLicense: {
      number: '',
      expireDate: '',
    },
    reference: {
      firstName: '',
      lastName: '',
      middleName: '',
      phone: '',
      email: '',
      relationship: '',
    },
    emergencyContacts: [],
    uploadedFiles: {
      driverLicense: '',
      workAuthorization: '',
    },
  });

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`http://${localHost}/api/onboarding/status`);
        console.log('response of status', response)
        // setApplication(response.data);
        setStatus(response.data.status);
        setFeedback(response.data.feedback);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching application:', error);
      }
    };

    fetchApplication();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    let endpoint = '';
    switch (e.target.name) {
      case 'profilePicture':
        endpoint = '/api/upload/profile-picture';
        break;
      case 'uploadedFiles.driverLicense':
        endpoint = '/api/upload/driver-license';
        break;
      case 'uploadedFiles.workAuthorization':
        endpoint = '/api/upload/opt-receipt';
        break;
      default:
        return;
    }

    try {
      const response = await axios.post(`http://localhost:3000${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File uploaded successfully:', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/onboarding', formData);
      setStatus('Pending');
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <div>
        <label>First Name:</label>
        <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Last Name:</label>
        <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Middle Name:</label>
        <input type="text" name="middleName" value={formData.middleName} onChange={handleInputChange} />
      </div>
      <div>
        <label>Preferred Name:</label>
        <input type="text" name="preferredName" value={formData.preferredName} onChange={handleInputChange} />
      </div>
      <div>
        <label>Profile Picture:</label>
        <input type="file" name="profilePicture" onChange={handleFileUpload} />
      </div>
      <div>
        <label>Current Address:</label>
        <input type="text" name="currentAddress.building" placeholder="Building/Apt #" value={formData.currentAddress.building} onChange={handleInputChange} />
        <input type="text" name="currentAddress.street" placeholder="Street Name" value={formData.currentAddress.street} onChange={handleInputChange} />
        <input type="text" name="currentAddress.city" placeholder="City" value={formData.currentAddress.city} onChange={handleInputChange} />
        <input type="text" name="currentAddress.state" placeholder="State" value={formData.currentAddress.state} onChange={handleInputChange} />
        <input type="text" name="currentAddress.zip" placeholder="Zip" value={formData.currentAddress.zip} onChange={handleInputChange} />
      </div>
      <div>
        <label>Cell Phone:</label>
        <input type="text" name="cellPhone" value={formData.cellPhone} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Work Phone:</label>
        <input type="text" name="workPhone" value={formData.workPhone} onChange={handleInputChange} />
      </div>
      <div>
        <label>Car Information:</label>
        <input type="text" name="carInfo.make" placeholder="Make" value={formData.carInfo.make} onChange={handleInputChange} />
        <input type="text" name="carInfo.model" placeholder="Model" value={formData.carInfo.model} onChange={handleInputChange} />
        <input type="text" name="carInfo.color" placeholder="Color" value={formData.carInfo.color} onChange={handleInputChange} />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" name="email" value={formData.email} readOnly />
      </div>
      <div>
        <label>SSN:</label>
        <input type="text" name="ssn" value={formData.ssn} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Date of Birth:</label>
        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Gender:</label>
        <select name="gender" value={formData.gender} onChange={handleInputChange}>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="I do not wish to answer">I do not wish to answer</option>
        </select>
      </div>
      <div>
        <label>Are you a citizen or permanent resident of the U.S?</label>
        <select name="visaType" value={formData.visaType} onChange={handleInputChange} required>
          <option value="Green Card">Green Card</option>
          <option value="Citizen">Citizen</option>
          <option value="H1B Category">H1B Category</option>
          <option value="F1 Category">F1 Category</option>
          <option value="Other">Other</option>
        </select>
      </div>
      {formData.visaType === 'F1 Category' && (
        <div>
          <label>Upload OPT Receipt:</label>
          <input type="file" name="uploadedFiles.workAuthorization" onChange={handleFileUpload} />
        </div>
      )}
      {formData.visaType === 'Other' && (
        <div>
          <label>Specify Visa Title:</label>
          <input type="text" name="visaTitle" value={formData.visaTitle} onChange={handleInputChange} />
        </div>
      )}
      <div>
        <label>Do you have a driver's license?</label>
        <input type="checkbox" name="hasDriverLicense" checked={formData.hasDriverLicense} onChange={handleInputChange} />
      </div>
      {formData.hasDriverLicense && (
        <>
          <div>
            <label>Driver's License Number:</label>
            <input type="text" name="driverLicense.number" value={formData.driverLicense.number} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Expiration Date:</label>
            <input type="date" name="driverLicense.expireDate" value={formData.driverLicense.expireDate} onChange={handleInputChange} required />
          </div>
          <div>
            <label>Upload Driver's License:</label>
            <input type="file" name="uploadedFiles.driverLicense" onChange={handleFileUpload} />
          </div>
        </>
      )}
      <div>
        <label>Reference:</label>
        <input type="text" name="reference.firstName" placeholder="First Name" value={formData.reference.firstName} onChange={handleInputChange} required />
        <input type="text" name="reference.lastName" placeholder="Last Name" value={formData.reference.lastName} onChange={handleInputChange} required />
        <input type="text" name="reference.middleName" placeholder="Middle Name" value={formData.reference.middleName} onChange={handleInputChange} />
        <input type="text" name="reference.phone" placeholder="Phone" value={formData.reference.phone} onChange={handleInputChange} required />
        <input type="email" name="reference.email" placeholder="Email" value={formData.reference.email} onChange={handleInputChange} required />
        <input type="text" name="reference.relationship" placeholder="Relationship" value={formData.reference.relationship} onChange={handleInputChange} required />
      </div>
      <div>
        <label>Emergency Contacts:</label>
        {formData.emergencyContacts.map((contact, index) => (
          <div key={index}>
            <input type="text" name={`emergencyContacts[${index}].firstName`} placeholder="First Name" value={contact.firstName} onChange={handleInputChange} required />
            <input type="text" name={`emergencyContacts[${index}].lastName`} placeholder="Last Name" value={contact.lastName} onChange={handleInputChange} required />
            <input type="text" name={`emergencyContacts[${index}].middleName`} placeholder="Middle Name" value={contact.middleName} onChange={handleInputChange} />
            <input type="text" name={`emergencyContacts[${index}].phone`} placeholder="Phone" value={contact.phone} onChange={handleInputChange} required />
            <input type="email" name={`emergencyContacts[${index}].email`} placeholder="Email" value={contact.email} onChange={handleInputChange} required />
            <input type="text" name={`emergencyContacts[${index}].relationship`} placeholder="Relationship" value={contact.relationship} onChange={handleInputChange} required />
          </div>
        ))}
        <button type="button" onClick={() => setFormData({ ...formData, emergencyContacts: [...formData.emergencyContacts, { firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' }] })}>
          Add Emergency Contact
        </button>
      </div>
      <div>
        <label>Summary of Uploaded Files:</label>
        <ul>
          {formData.profilePicture && <li>Profile Picture</li>}
          {formData.uploadedFiles.driverLicense && <li>Driver's License</li>}
          {formData.uploadedFiles.workAuthorization && <li>Work Authorization</li>}
        </ul>
      </div>
      <button type="submit">Submit</button>
    </form>
  );

  const renderPendingMessage = () => (
    <div>
      <p>Please wait for HR to review your application. Below is your submitted application and uploaded documents:</p>
      <div>
        <h3>Submitted Application</h3>
        <div>
          <p><strong>First Name:</strong> {formData.firstName}</p>
          <p><strong>Last Name:</strong> {formData.lastName}</p>
          <p><strong>Middle Name:</strong> {formData.middleName}</p>
          <p><strong>Preferred Name:</strong> {formData.preferredName}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Cell Phone:</strong> {formData.cellPhone}</p>
          <p><strong>Work Phone:</strong> {formData.workPhone}</p>
          <p><strong>Current Address:</strong> {`${formData.currentAddress.building}, ${formData.currentAddress.street}, ${formData.currentAddress.city}, ${formData.currentAddress.state}, ${formData.currentAddress.zip}`}</p>
          <p><strong>Car Information:</strong> {`${formData.carInfo.make}, ${formData.carInfo.model}, ${formData.carInfo.color}`}</p>
          <p><strong>SSN:</strong> {formData.ssn}</p>
          <p><strong>Date of Birth:</strong> {formData.dob}</p>
          <p><strong>Gender:</strong> {formData.gender}</p>
          <p><strong>Visa Type:</strong> {formData.visaType}</p>
          {formData.visaType === 'Other' && <p><strong>Visa Title:</strong> {formData.visaTitle}</p>}
          {formData.hasDriverLicense && (
            <>
              <p><strong>Driver's License Number:</strong> {formData.driverLicense.number}</p>
              <p><strong>Expiration Date:</strong> {formData.driverLicense.expireDate}</p>
            </>
          )}
        </div>
      </div>
      {/* <div>
        <h3>Uploaded Documents</h3>
        <ul>
          {formData.profilePicture && (
            <li>
              <a href={`http://localhost:3000/uploads/${formData.profilePicture}`} target="_blank" rel="noopener noreferrer">Profile Picture</a>
              <a href={`http://localhost:3000/uploads/${formData.profilePicture}`} download>Download</a>
            </li>
          )}
          {formData.uploadedFiles.driverLicense && (
            <li>
              <a href={`http://localhost:3000/uploads/${formData.uploadedFiles.driverLicense}`} target="_blank" rel="noopener noreferrer">Driver's License</a>
              <a href={`http://localhost:3000/uploads/${formData.uploadedFiles.driverLicense}`} download>Download</a>
            </li>
          )}
          {formData.uploadedFiles.workAuthorization && (
            <li>
              <a href={`http://localhost:3000/uploads/${formData.uploadedFiles.workAuthorization}`} target="_blank" rel="noopener noreferrer">Work Authorization</a>
              <a href={`http://localhost:3000/uploads/${formData.uploadedFiles.workAuthorization}`} download>Download</a>
            </li>
          )}
        </ul>
      </div> */}
    </div>
  );


  const renderRejectedMessage = () => (
    <div>
      <p>Your application was rejected. Feedback: {feedback}</p>
      {renderForm()}
    </div>
  );

  const renderContent = () => {
    switch (status) {
      case 'Not Started':
        return renderForm();
      case 'Pending':
        return renderPendingMessage();
      case 'Rejected':
        return renderRejectedMessage();
      case 'Approved':
        window.location.href = '/index.html';
        return null;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Onboarding Application</h1>
      {renderContent()}
    </div>
  );
};

export default Application;
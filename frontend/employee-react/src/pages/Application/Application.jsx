import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setDocumentKey, selectDocumentKeys } from '../../store/documentSlice/documentSlice';
import {
  TextField, Button, Select, MenuItem, FormControl, InputLabel, Checkbox, FormControlLabel,
  Container, Typography, Paper, Pagination
} from '@mui/material';
import { Grid2 as Grid } from '@mui/material';

const Application = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState('Not Started');
  const documentKeys = useSelector(selectDocumentKeys);
  const [feedback, setFeedback] = useState('');
  const localHost = 'localhost:3000';
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

  const [page, setPage] = useState(1);
  const totalPages = 3;

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`http://${localHost}/api/onboarding/status`);
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

      if (Array.isArray(current)) {
        current[parseInt(keys[keys.length - 1], 10)] = value;
      } else {
        current[keys[keys.length - 1]] = value;
      }

      return newState;
    });
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
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc4N2Y5Y2MxMjAzMWVlZjFmOWY2ODRhIiwiaWF0IjoxNzM3MDQzODE5LCJleHAiOjE3MzcwNTgyMTl9.IW-g89gumG7gHTBP7lMcF5OvQLxkLry8DmE3xmttafo',
        },
      });
      dispatch(setDocumentKey({ documentType: e.target.name, key: response.data.key }));
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  useEffect(() => {
    const fetchAndOpenUrl = async () => {
      const url = await getPresignedUrl(documentKeys.profilePicture);
      if (url) {
        window.open(url, '_blank');
      }
    };

    fetchAndOpenUrl();
  }, [documentKeys]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/onboarding', formData);
      setStatus('Pending');
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  const renderFormPage1 = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Personal Information</Typography>
        <TextField
          label="First Name"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          label="Middle Name"
          name="middleName"
          value={formData.middleName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Preferred Name"
          name="preferredName"
          value={formData.preferredName}
          onChange={handleInputChange}
          fullWidth
        />
        <Button
          variant="contained"
          component="label"
        >
          Upload Profile Picture
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileUpload}
            hidden
          />
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Current Address</Typography>
        <TextField
          label="Building/Apt #"
          name="currentAddress.building"
          placeholder="Building/Apt #"
          value={formData.currentAddress.building}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Street Name"
          name="currentAddress.street"
          placeholder="Street Name"
          value={formData.currentAddress.street}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="City"
          name="currentAddress.city"
          placeholder="City"
          value={formData.currentAddress.city}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="State"
          name="currentAddress.state"
          placeholder="State"
          value={formData.currentAddress.state}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Zip"
          name="currentAddress.zip"
          placeholder="Zip"
          value={formData.currentAddress.zip}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>
    </Grid>
  );

  const renderFormPage2 = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Car Information</Typography>
        <TextField
          label="Make"
          name="carInfo.make"
          placeholder="Make"
          value={formData.carInfo.make}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Model"
          name="carInfo.model"
          placeholder="Model"
          value={formData.carInfo.model}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Color"
          name="carInfo.color"
          placeholder="Color"
          value={formData.carInfo.color}
          onChange={handleInputChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Additional Information</Typography>
        <TextField
          label="SSN"
          name="ssn"
          value={formData.ssn}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          onChange={handleInputChange}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          required
        />
        <FormControl fullWidth>
          <InputLabel>Gender</InputLabel>
          <Select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="I do not wish to answer">I do not wish to answer</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Are you a citizen or permanent resident of the U.S?</InputLabel>
          <Select
            name="visaType"
            value={formData.visaType}
            onChange={handleInputChange}
            required
          >
            <MenuItem value="Green Card">Green Card</MenuItem>
            <MenuItem value="Citizen">Citizen</MenuItem>
            <MenuItem value="H1B Category">H1B Category</MenuItem>
            <MenuItem value="F1 Category">F1 Category</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        {formData.visaType === 'F1 Category' && (
          <Button
            variant="contained"
            component="label"
          >
            Upload OPT Receipt
            <input
              type="file"
              name="uploadedFiles.workAuthorization"
              onChange={handleFileUpload}
              hidden
            />
          </Button>
        )}
        {formData.visaType === 'Other' && (
          <TextField
            label="Specify Visa Title"
            name="visaTitle"
            value={formData.visaTitle}
            onChange={handleInputChange}
            fullWidth
          />
        )}
        <FormControlLabel
          control={
            <Checkbox
              name="hasDriverLicense"
              checked={formData.hasDriverLicense}
              onChange={handleInputChange}
            />
          }
          label="Do you have a driver's license?"
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
            />
            <TextField
              label="Expiration Date"
              name="driverLicense.expireDate"
              type="date"
              value={formData.driverLicense.expireDate}
              onChange={handleInputChange}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
            <Button
              variant="contained"
              component="label"
            >
              Upload Driver's License
              <input
                type="file"
                name="uploadedFiles.driverLicense"
                onChange={handleFileUpload}
                hidden
              />
            </Button>
          </>
        )}
      </Grid>
    </Grid>
  );

  const renderFormPage3 = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Reference (who referred you to this company? There can only be 1)</Typography>
        <TextField
          label="First Name"
          name="reference.firstName"
          placeholder="First Name"
          value={formData.reference.firstName}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          label="Last Name"
          name="reference.lastName"
          placeholder="Last Name"
          value={formData.reference.lastName}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          label="Middle Name"
          name="reference.middleName"
          placeholder="Middle Name"
          value={formData.reference.middleName}
          onChange={handleInputChange}
          fullWidth
        />
        <TextField
          label="Phone"
          name="reference.phone"
          placeholder="Phone"
          value={formData.reference.phone}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="reference.email"
          placeholder="Email"
          value={formData.reference.email}
          onChange={handleInputChange}
          fullWidth
          required
        />
        <TextField
          label="Relationship"
          name="reference.relationship"
          placeholder="Relationship"
          value={formData.reference.relationship}
          onChange={handleInputChange}
          fullWidth
          required
        />
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Emergency Contacts</Typography>
        {formData.emergencyContacts.map((contact, index) => (
          <Grid container spacing={2} key={index}>
            <Grid item xs={12}>
              <TextField
                label="First Name"
                name={`emergencyContacts[${index}].firstName`}
                placeholder="First Name"
                value={contact.firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Last Name"
                name={`emergencyContacts[${index}].lastName`}
                placeholder="Last Name"
                value={contact.lastName}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Middle Name"
                name={`emergencyContacts[${index}].middleName`}
                placeholder="Middle Name"
                value={contact.middleName}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                label="Phone"
                name={`emergencyContacts[${index}].phone`}
                placeholder="Phone"
                value={contact.phone}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Email"
                name={`emergencyContacts[${index}].email`}
                placeholder="Email"
                value={contact.email}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Relationship"
                name={`emergencyContacts[${index}].relationship`}
                placeholder="Relationship"
                value={contact.relationship}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
          </Grid>
        ))}
        <Button
          variant="contained"
          onClick={() => setFormData({
            ...formData,
            emergencyContacts: [...formData.emergencyContacts, { firstName: '', lastName: '', middleName: '', phone: '', email: '', relationship: '' }]
          })}
        >
          Add Emergency Contact
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">Summary of Uploaded Files</Typography>
        <ul>
          {documentKeys.profilePicture && (
            <li>
              <a href="#" onClick={async (e) => {
                e.preventDefault();
                const url = await getPresignedUrl(documentKeys.profilePicture);
                window.open(url, '_blank');
              }}>Profile Picture</a>
              <a href="#" onClick={async (e) => {
                e.preventDefault();
                const url = await getPresignedUrl(documentKeys.profilePicture);
                window.location.href = url;
              }}>Download</a>
            </li>
          )}
          {documentKeys.driverLicense && (
            <li>
              <a href="#" onClick={async (e) => {
                e.preventDefault();
                const url = await getPresignedUrl(documentKeys.uploadedFiles.driverLicense);
                window.open(url, '_blank');
              }}>Driver's License</a>
              <a href="#" onClick={async (e) => {
                e.preventDefault();
                const url = await getPresignedUrl(documentKeys.uploadedFiles.driverLicense);
                window.location.href = url;
              }}>Download</a>
            </li>
          )}
          {documentKeys.workAuthorization && (
            <li>
              <a href="#" onClick={async (e) => {
                e.preventDefault();
                const url = await getPresignedUrl(documentKeys.uploadedFiles.workAuthorization);
                window.open(url, '_blank');
              }}>Work Authorization</a>
              <a href="#" onClick={async (e) => {
                e.preventDefault();
                const url = await getPresignedUrl(documentKeys.workAuthorization);
                window.location.href = url;
              }}>Download</a>
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

  const getPresignedUrl = async (fileName) => {
    try {
      const response = await axios.get(`http://${localHost}/api/upload/presigned-url`, {
        params: { fileName },
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjc4N2Y5Y2MxMjAzMWVlZjFmOWY2ODRhIiwiaWF0IjoxNzM3MDQzODE5LCJleHAiOjE3MzcwNTgyMTl9.IW-g89gumG7gHTBP7lMcF5OvQLxkLry8DmE3xmttafo',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Error fetching pre-signed URL:', error);
    }
  };

  const renderPendingMessage = () => (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="body1">
        Please wait for HR to review your application. Below is your submitted application and uploaded documents:
      </Typography>
      <Typography variant="h6">Submitted Application</Typography>
      <Typography variant="body2"><strong>First Name:</strong> {formData.firstName}</Typography>
      <Typography variant="body2"><strong>Last Name:</strong> {formData.lastName}</Typography>
      <Typography variant="body2"><strong>Middle Name:</strong> {formData.middleName}</Typography>
      <Typography variant="body2"><strong>Preferred Name:</strong> {formData.preferredName}</Typography>
      <Typography variant="body2"><strong>Email:</strong> {formData.email}</Typography>
      <Typography variant="body2"><strong>Cell Phone:</strong> {formData.cellPhone}</Typography>
      <Typography variant="body2"><strong>Work Phone:</strong> {formData.workPhone}</Typography>
      <Typography variant="body2"><strong>Current Address:</strong> {`${formData.currentAddress.building}, ${formData.currentAddress.street}, ${formData.currentAddress.city}, ${formData.currentAddress.state}, ${formData.currentAddress.zip}`}</Typography>
      <Typography variant="body2"><strong>Car Information:</strong> {`${formData.carInfo.make}, ${formData.carInfo.model}, ${formData.carInfo.color}`}</Typography>
      <Typography variant="body2"><strong>SSN:</strong> {formData.ssn}</Typography>
      <Typography variant="body2"><strong>Date of Birth:</strong> {formData.dob}</Typography>
      <Typography variant="body2"><strong>Gender:</strong> {formData.gender}</Typography>
      <Typography variant="body2"><strong>Visa Type:</strong> {formData.visaType}</Typography>
      {formData.visaType === 'Other' && <Typography variant="body2"><strong>Visa Title:</strong> {formData.visaTitle}</Typography>}
      {formData.hasDriverLicense && (
        <>
          <Typography variant="body2"><strong>Driver's License Number:</strong> {formData.driverLicense.number}</Typography>
          <Typography variant="body2"><strong>Expiration Date:</strong> {formData.driverLicense.expireDate}</Typography>
        </>
      )}
      <Typography variant="h6">Uploaded Documents</Typography>
      <ul>
        {documentKeys.profilePicture && (
          <li>
            <a href="#" onClick={async (e) => {
              e.preventDefault();
              try {
                const url = await getPresignedUrl(documentKeys.profilePicture);
                if (url) {
                  window.open(url, '_blank');
                } else {
                  console.error('Failed to retrieve URL');
                }
              } catch (error) {
                console.error('Error fetching profile picture URL:', error);
              }
            }}>Profile Picture</a>
            <a href="#" onClick={async (e) => {
              e.preventDefault();
              const url = await getPresignedUrl(documentKeys.profilePicture);
              window.location.href = url;
            }}>Download</a>
          </li>
        )}
        {documentKeys.driverLicense && (
          <li>
            <a href="#" onClick={async (e) => {
              e.preventDefault();
              const url = await getPresignedUrl(documentKeys.uploadedFiles.driverLicense);
              window.open(url, '_blank');
            }}>Driver's License</a>
            <a href="#" onClick={async (e) => {
              e.preventDefault();
              const url = await getPresignedUrl(documentKeys.uploadedFiles.driverLicense);
              window.location.href = url;
            }}>Download</a>
          </li>
        )}
        {documentKeys.workAuthorization && (
          <li>
            <a href="#" onClick={async (e) => {
              e.preventDefault();
              const url = await getPresignedUrl(documentKeys.uploadedFiles.workAuthorization);
              window.open(url, '_blank');
            }}>Work Authorization</a>
            <a href="#" onClick={async (e) => {
              e.preventDefault();
              const url = await getPresignedUrl(documentKeys.workAuthorization);
              window.location.href = url;
            }}>Download</a>
          </li>
        )}
      </ul>
    </Paper>
  );

  const renderRejectedMessage = () => (
    <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
      <Typography variant="body1">Your application was rejected. Feedback: {feedback}</Typography>
      {renderForm()}
    </Paper>
  );

  const renderContent = () => {
    switch (status) {
      case 'Not Started':
        return (
          <form onSubmit={handleSubmit}>
            {renderForm()}
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">Submit</Button>
            </Grid>
          </form>
        );
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
    <Container>
      <Typography variant="h4" gutterBottom>Onboarding Application</Typography>
      {renderContent()}
      <Pagination
        count={totalPages}
        page={page}
        onChange={(event, value) => setPage(value)}
        color="primary"
        style={{ marginTop: '20px' }}
      />
    </Container>
  );
};

export default Application;
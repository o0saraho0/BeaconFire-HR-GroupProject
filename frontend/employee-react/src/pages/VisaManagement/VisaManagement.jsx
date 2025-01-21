import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
  Box,
  Grid,
} from "@mui/material";
import axios from "axios";
import "./VisaManagement.css";

const VisaManagement = () => {
  const [visaData, setVisaData] = useState(null); // For visa data
  const [loading, setLoading] = useState(true); // For loading state
  const [error, setError] = useState(null); // For error state
  const [selectedFile, setSelectedFile] = useState(null); // For file input
  const [uploading, setUploading] = useState(false); // For uploading state
  const [uploadMessage, setUploadMessage] = useState(null); // For upload success/error message
  const [refresh, setFrefresh] = useState(0);
  const localHost = "localhost:3000";
  const userId = useSelector((state) => state.auth.userId);

<<<<<<< HEAD
  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        if (!userId) {
          throw new Error("User is not authenticated");
=======
    useEffect(() => {
        
        const fetchVisaData = async () => {
        try {
            if (!userId) {
                throw new Error("User is not authenticated");  
            }
            const response = await axios.get(
            `http://${localHost}/api/visa/${userId}`
            );
            setVisaData(response.data.visa); // Set the fetched data
            console.log(visaData)
            if(!visaData){
                throw new Error("You do not need to upload visa documents!");
            }
            setLoading(false);
        } catch (err) {
            if(err.message=="You do not need to upload visa documents!"){
                setError(err.message);
            }else{
                setError("Failed to fetch visa data. Please try again.");
            }
            setLoading(false);
>>>>>>> dev
        }
        const response = await axios.get(
          `http://${localHost}/api/visa/${userId}`
        );
        setVisaData(response.data.visa); // Set the fetched data
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch visa data. Please try again.");
        setLoading(false);
      }
    };

    fetchVisaData();
  }, [refresh]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

<<<<<<< HEAD
  const handleFileUpload = async () => {
    if (!selectedFile) {
      setUploadMessage("Please select a file to upload.");
      return;
=======
    const handleFileUpload = async () => {
        if (!selectedFile) {
        setUploadMessage("Please select a file to upload.");
        return;
        }

        setUploading(true);
        setUploadMessage(null);

        try {
        const formData = new FormData();
        formData.append("user_id", visaData.user_id._id);
        formData.append(
            "documentType",
            visaData.stage.toLowerCase().replace(" ", "_")
        );
        formData.append("file", selectedFile);

        const response = await axios.post(
            `http://${localHost}/api/visa/upload`,
            formData,
            {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            }
        );

        setUploadMessage(response.data.message);
        setFrefresh((key)=>key+1)
        } catch (err) {
        setUploadMessage(
            err.response?.data?.message || "An error occurred during upload."
        );
        } finally {
        setUploading(false);
        }
    };

    const getNextStepMessage = (status, stage, message) => {
        if (status === "Reject") return message;
        if (stage === "Complete") return "All documents have been approved.";
        if (status === "Not Started"){
            if(stage=="OPT Receipt"){
                return "Please uploaded your OPT Receipt"
            }else if(stage=="OPT EAD"){
                return "Please upload a copy of your OPT EAD"
            }else if(stage=="I983"){
                return "Please download and fill out the I-983 form"
            }else if(stage=="I20"){
                return "Please send the I-983 along with all necessary documents to your school and upload the new I-20"
            }
        }
        if (status === "Pending"){
            if(stage=="OPT Receipt"){
                return "Waiting for HR to approve your OPT Receipt"
            }else if(stage=="OPT EAD"){
                return "Waiting for HR to approve your OPT EAD"
            }else if(stage=="I983"){
                return "Waiting for HR to approve and sign your I-983"
            }else if(stage=="I20"){
                return "Waiting for HR to approve your I-20"
            }
        }
        return "No further action required.";
    };

    if (loading) {
        return (
        <Container sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
        </Container>
        );
>>>>>>> dev
    }

    setUploading(true);
    setUploadMessage(null);

    try {
      const formData = new FormData();
      formData.append("user_id", visaData.user_id._id);
      formData.append(
        "documentType",
        visaData.stage.toLowerCase().replace(" ", "_")
      );
      formData.append("file", selectedFile);

      const response = await axios.post(
        `http://${localHost}/api/visa/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadMessage(response.data.message);
      setFrefresh((key) => key + 1);
    } catch (err) {
      setUploadMessage(
        err.response?.data?.message || "An error occurred during upload."
      );
    } finally {
      setUploading(false);
    }
  };

  const getNextStepMessage = (status, stage, message) => {
    if (status === "Reject") return message;
    if (stage === "Complete") return "All documents have been approved.";
    if (status === "Not Started") {
      if (stage == "OPT Receipt") {
        return "Please uploaded your OPT Receipt";
      } else if (stage == "OPT EAD") {
        return "Please upload a copy of your OPT EAD";
      } else if (stage == "I983") {
        return "Please download and fill out the I-983 form";
      } else if (stage == "I20") {
        return "Please send the I-983 along with all necessary documents to your school and upload the new I-20";
      }
    }
    if (status === "Pending") {
      if (stage == "OPT Receipt") {
        return "Waiting for HR to approve your OPT Receipt";
      } else if (stage == "EAD") {
        return "Waiting for HR to approve your OPT EAD";
      } else if (stage == "I983") {
        return "Waiting for HR to approve and sign your I-983";
      } else if (stage == "I20") {
        return "Waiting for HR to approve your I-20";
      }
    }
    return "No further action required.";
  };

  if (loading) {
    return (
      <Container sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ marginTop: 10 }}>
      <Card className="container" variant="outlined">
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Visa Details
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>User ID:</strong> {visaData.user_id._id}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Username:</strong> {visaData.user_id.username}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Email:</strong> {visaData.user_id.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>OPT Status:</strong> {visaData.is_opt ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Stage:</strong> {visaData.stage}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body1">
                <strong>Status:</strong> {visaData.status}
              </Typography>
            </Grid>
            {/* <Grid item xs={12}>
                <Typography variant="body1">
                    <strong>Message:</strong> {visaData.message}
                </Typography>
                </Grid> */}
            <Grid item xs={12}>
              <Typography variant="body1">
                <strong>Next Step:</strong>{" "}
                <span
                  style={{
                    color: visaData.status === "Reject" ? "red" : "blue",
                    fontWeight: "bold",
                  }}
                >
                  {getNextStepMessage(
                    visaData.status,
                    visaData.stage,
                    visaData.message
                  )}
                </span>
              </Typography>
            </Grid>
            <Grid item xs={12}>
              {visaData.stage == "I983" &&
                (visaData.status == "Not Started" ||
                  visaData.status == "Reject") && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      component="a"
                      href="https://hr-management-bucket666.s3.us-east-1.amazonaws.com/visa-documents/I983/i983_empty.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Empty Template
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      component="a"
                      href="https://hr-management-bucket666.s3.us-east-1.amazonaws.com/visa-documents/I983/i983_sample.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Sample Template
                    </Button>
                  </Box>
                )}
            </Grid>
          </Grid>

          {visaData.stage !== "Complete" && (
            <Box mt={3}>
              <Typography variant="body1" gutterBottom>
                Upload {visaData.stage} Document:
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Button
                  component="label"
                  variant="contained"
                  color="primary"
                  disabled={uploading}
                >
                  Choose File
                  <input type="file" hidden onChange={handleFileChange} />
                </Button>
                {selectedFile && (
                  <Typography variant="body2">{selectedFile.name}</Typography>
                )}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleFileUpload}
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? <CircularProgress size={20} /> : "Upload"}
                </Button>
              </Box>
            </Box>
          )}

          {uploadMessage && (
            <Box mt={2}>
              <Alert severity="info">{uploadMessage}</Alert>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default VisaManagement;

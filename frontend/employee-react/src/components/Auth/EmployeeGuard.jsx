import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import axios from "../../interceptors/auth.interceptor.js"; // Import your Axios interceptor
import { Container, Typography, Button, CircularProgress } from "@mui/material"; // Import Material-UI components

const EmployeeGuard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEmployee, setIsEmployee] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkEmployeeRole = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/user/details"
        );
        if (response.data.role === "employee") {
          setIsEmployee(true);
        } else {
          setIsEmployee(false);
        }
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    checkEmployeeRole();
  }, []);

  if (isLoading) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Container>
    ); // Center loading spinner
  }

  if (error || !isEmployee) {
    return (
      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography variant="h4" gutterBottom>
          You don't have permission to view this page.
        </Typography>
        <Button variant="contained" color="primary" href="/application">
          Go to Application
        </Button>
      </Container>
    );
  }

  return <Outlet />;
};

export default EmployeeGuard;

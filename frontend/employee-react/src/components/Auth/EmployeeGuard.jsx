import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "../../interceptors/auth.interceptor.js";
import EmployeeNavbar from "../Navbar/EmployeeNavbar";

const EmployeeGuard = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
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

    // Only check role if authenticated
    if (isAuthenticated) {
      checkEmployeeRole();
    } else {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // First check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Then handle loading state
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
    );
  }

  // Handle error or non-employee access
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

  // Render employee content with navbar
  return (
    <>
      <EmployeeNavbar />
      <Box sx={{ marginTop: "64px" }}>
        <Outlet />
      </Box>
    </>
  );
};

export default EmployeeGuard;

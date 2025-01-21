import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useDispatch } from "react-redux";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { clearError, registerUser } from "../../store/AuthSlice/auth.slice"; // Assuming this exists

const Register = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(true);

  useEffect(() => {
    dispatch(clearError());
    validateToken();
  }, [token]);

  const validateToken = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/registration/validate-register-token",
        { token }
      );

      setFormData((prev) => ({
        ...prev,
        email: data.email,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Token validation failed");
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await dispatch(registerUser(formData)).unwrap();
      alert("Register successful. You may login now.");
      navigate("/login"); // Redirect to login on success
    } catch (err) {
      setError(err || "Registration failed");
    }
  };

  if (isValidating) {
    return (
      <Container maxWidth="sm">
        <Typography>Validating token...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 3, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            value={formData.email}
            disabled
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;

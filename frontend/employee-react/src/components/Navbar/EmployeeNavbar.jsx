// components/Navbar/EmployeeNavbar.jsx
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab, AppBar, Box, Button } from "@mui/material";
import { logout } from "../../store/AuthSlice/auth.slice";

const EmployeeNavbar = () => {
  const [value, setValue] = useState(0);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Synchronize the `value` with the current URL path
  useEffect(() => {
    switch (window.location.pathname) {
      case "/personalprofile":
        setValue(0);
        break;
      case "/visa-status":
        setValue(1);
        break;
      case "/housing":
        setValue(2);
        break;
      default:
        setValue(0);
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    switch (newValue) {
      case 0:
        navigate("/personalprofile");
        break;
      case 1:
        navigate("/visa-status");
        break;
      case 2:
        navigate("/housing");
        break;
      default:
        break;
    }
  };

  return (
    <AppBar position="fixed" color="primary">
      <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            flexGrow: 2,
            "& .MuiTabs-indicator": {
              backgroundColor: "white",
            },
          }}
        >
          <Tab label="Personal Information" />
          <Tab label="Visa Status Management" />
          <Tab label="Housing" />
        </Tabs>
        {!loading && (
          <Button
            color="inherit"
            onClick={() => navigate("/logout")}
            sx={{ textDecoration: "none", color: "inherit" }}
          >
            Logout
          </Button>
        )}
      </Box>
    </AppBar>
  );
};

export default EmployeeNavbar;

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Tabs, Tab, AppBar, Box, Button } from "@mui/material";

const Navbar = () => {
  const [value, setValue] = useState(0);
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

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
        window.location.href = "/personalprofile";
        break;
      case 1:
        window.location.href = "/visa-status";
        break;
      case 2:
        window.location.href = "/housing";
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
        {!loading &&
          (isAuthenticated ? (
            <Button
              color="inherit"
              href="/logout"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              Logout
            </Button>
          ) : (
            <Button
              color="inherit"
              href="/login"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              Login
            </Button>
          ))}
      </Box>
    </AppBar>
  );
};

export default Navbar;

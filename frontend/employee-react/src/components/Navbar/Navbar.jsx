import { Tabs, Tab, AppBar, Box, Button } from "@mui/material";
import { BrowserRouter as Router, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <Router>
      <AppBar position="fixed" color="primary">
        <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
          <Tabs
            textColor="inherit"
            indicatorColor="secondary"
            sx={{ flexGrow: 2 }}
          >
            <Tab
              label="Personal Information"
              component={Link}
              to="/personalprofile"
            />
            <Tab
              label="Visa Status Management"
              component={Link}
              // to="/visa-status"
            />
            <Tab
              label="Housing"
              component={Link}
              // to="/housing"
            />
          </Tabs>
          <Button color="inherit" component={Link} to="/login">
            Login
          </Button>
        </Box>
      </AppBar>
    </Router>
  );
};

export default Navbar;

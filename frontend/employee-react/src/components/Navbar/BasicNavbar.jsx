import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppBar, Box, Button, Tab, Tabs } from "@mui/material";

const BasicNavbar = () => {
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" color="primary">
      <Box sx={{ display: "flex", alignItems: "center", padding: 2 }}>
        <Tabs
          value={0}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            flexGrow: 2,
            "& .MuiTabs-indicator": {
              backgroundColor: "white",
            },
          }}
        >
          <Tab label="Application" onClick={() => navigate("/application")} />
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

export default BasicNavbar;

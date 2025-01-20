import { useEffect } from "react";
import { Link } from "react-router";
import { Box, Typography, Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { logout } from "../../store/AuthSlice/auth.slice";

const LogoutPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      gap={2}
    >
      <Typography variant="h4">
        You have been logged out successfully
      </Typography>
      <Button component={Link} to="/login" variant="contained" color="primary">
        Back to Login
      </Button>
    </Box>
  );
};

export default LogoutPage;

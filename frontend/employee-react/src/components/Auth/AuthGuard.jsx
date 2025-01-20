import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";
import BasicNavbar from "../Navbar/BasicNavbar";

const AuthGuard = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <BasicNavbar />
      <Box sx={{ marginTop: "64px" }}>
        <Outlet />
      </Box>
    </>
  );
};

export default AuthGuard;

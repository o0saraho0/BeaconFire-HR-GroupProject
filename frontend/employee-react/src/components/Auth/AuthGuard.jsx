import { Navigate, Outlet } from "react-router";
import { useSelector } from "react-redux";

const Guard = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  /* Outlet is a placeholder for the child components of the current route */
  //return isLoggedIn ? <Outlet /> : <h1>You are not logged in</h1>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Render nested routes
  return <Outlet />;
};

export default Guard;

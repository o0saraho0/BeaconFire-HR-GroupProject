import { Outlet } from "react-router";
import { useSelector } from "react-redux";

const Guard = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  /* Outlet is a placeholder for the child components of the current route */
  //return isLoggedIn ? <Outlet /> : <h1>You are not logged in</h1>;

  // TODO: replace this with the Outlet component
  return isAuthenticated ? (
    <h1>hello from inside the AuthGuard</h1>
  ) : (
    <h1>You are not logged in</h1>
  );
};

export default Guard;

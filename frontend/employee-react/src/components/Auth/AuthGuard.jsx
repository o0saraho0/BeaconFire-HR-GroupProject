import { Outlet } from "react-router";

const Guard = () => {
  const isLoggedIn = false;

  // // conditional rendering
  /* Outlet is a placeholder for the child components of the current route */
  return isLoggedIn ? <Outlet /> : <h1>You are not logged in</h1>;
};

export default Guard;

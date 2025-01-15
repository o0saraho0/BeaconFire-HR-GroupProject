import { Outlet } from "react-router";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../store/userSlice/user.slice";

const Guard = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  /* Outlet is a placeholder for the child components of the current route */
  //return isLoggedIn ? <Outlet /> : <h1>You are not logged in</h1>;

  // TODO: replace this with the Outlet component
  return isLoggedIn ? (
    <h1>hello from inside the AuthGuard</h1>
  ) : (
    <h1>You are not logged in</h1>
  );
};

export default Guard;

import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import Guard from "./components/Auth/AuthGuard";

import { useDispatch } from "react-redux";
import { login } from "./store/userSlice/user.slice";

import { useEffect } from "react";

import Application from "./pages/Application/application.jsx";
import PersonalProfile from "./pages/PersonalProfile/PersonalProfile.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Guard />,
    children: [],
  },
  {
    path: "/application",
    element: <Application />,
  },
  {
    path: "/personalprofile",
    element: <PersonalProfile />,
  },
]);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(login());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}

export default App;

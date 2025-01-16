import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import Guard from "./components/Auth/AuthGuard";

import { useDispatch } from "react-redux";
import { login } from "./store/AuthSlice/auth.slice.js";

import { useEffect } from "react";

import Application from "./pages/Application/application.jsx";
import PersonalProfile from "./pages/PersonalProfile/PersonalProfile.jsx";
// import the axios object that we have defined with interceptors
import axios from "./interceptors/auth.interceptor";
// // if you don't use interceptors:
//import axios from 'axios';

import LoginPage from "./pages/LoginPage/LoginPage.jsx";
//import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Guard />,
    children: [],
  },
  {
    path: "/login",
    element: <LoginPage />,
    children: [],
  },
  // {
  //   path: "/register",
  //   element: <RegisterPage />,
  //   children: [],
  // },
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

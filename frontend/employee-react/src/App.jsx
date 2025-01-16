import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Guard from "./components/Auth/AuthGuard";

import Application from "./pages/Application/application.jsx";
import PersonalProfile from "./pages/PersonalProfile/PersonalProfile.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LogoutPage from "./pages/LogoutPage/LogoutPage.jsx";
import HousesPage from "./pages/HousesPage/HousePage.jsx";
//import FacilityReportsPage from "./pages/FacilityReportsPage/FacilityReportsPage.jsx";

import Navbar from "./components/Navbar/Navbar.jsx";

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
  {
    path: "/register/:token",
    element: <RegisterPage />,
    children: [],
  },
  {
    path: "/logout",
    element: <LogoutPage />,
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
  {
    path: "/housing",
    element: <HousesPage />,
  }
]);

function App() {
  return (
    <>
      <Navbar /> <RouterProvider router={router} />;
    </>
  );
}

export default App;

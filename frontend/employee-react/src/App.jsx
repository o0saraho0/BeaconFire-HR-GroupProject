import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import axios from "./interceptors/auth.interceptor.js";

import Guard from "./components/Auth/AuthGuard";
import EmployeeGuard from "./components/Auth/EmployeeGuard";
import Application from "./pages/Application/application.jsx";
import PersonalProfile from "./pages/PersonalProfile/PersonalProfile.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LogoutPage from "./pages/LogoutPage/LogoutPage.jsx";
import HousesPage from "./pages/HousesPage/HousePage.jsx";
import FacilityReportsPage from "./pages/FacilityReportsPage/FacilityReportsPage.jsx";

import Navbar from "./components/Navbar/Navbar.jsx";
import VisaManagement from "./pages/VisaManagement/VisaManagement.jsx";

function App() {
  // On application load, send req to server to see valid token.
  useEffect(() => {
    if (localStorage.getItem("token"))
      axios
        .get("http://localhost:3000/api/user/validate-token")
        .catch((error) => {
          // If token validation fails, redirect to logout
          alert("Your session is invalid... redirecting to logout");
          window.location.href = "/logout";
        });
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Protected Route */}
        <Route path="/" element={<Guard />}>
          <Route path="application" element={<Application />} />
          <Route path="personalprofile" element={<EmployeeGuard />}>
            <Route path="" element={<PersonalProfile />} />
          </Route>
          <Route path="housing" element={<EmployeeGuard />}>
            <Route path="" element={<HousesPage />} />
          </Route>
          <Route path="/visa-status" element={<EmployeeGuard />}>
            <Route path="" element={<VisaManagement />} />
          </Route>
          <Route path="/facility-reports/:houseId" element={<EmployeeGuard />}>
            <Route path="" element={<FacilityReportsPage />} />
          </Route>
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:token" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

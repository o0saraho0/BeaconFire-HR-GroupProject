import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "./interceptors/auth.interceptor.js";
import { logout } from "./store/AuthSlice/auth.slice";

// Guards
import Guard from "./components/Auth/AuthGuard";
import EmployeeGuard from "./components/Auth/EmployeeGuard";

// Pages
import Application from "./pages/Application/application.jsx";
import PersonalProfile from "./pages/PersonalProfile/PersonalProfile.jsx";
import LoginPage from "./pages/LoginPage/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
import LogoutPage from "./pages/LogoutPage/LogoutPage.jsx";
import HousesPage from "./pages/HousesPage/HousePage.jsx";
import FacilityReportsPage from "./pages/FacilityReportsPage/FacilityReportsPage.jsx";
import VisaManagement from "./pages/VisaManagement/VisaManagement.jsx";

function App() {
  const dispatch = useDispatch();

  // Validate token on application load
  useEffect(() => {
    if (localStorage.getItem("token")) {
      axios
        .get("http://localhost:3000/api/user/validate-token")
        .catch((error) => {
          dispatch(logout());
          alert("Your session is invalid... redirecting to logout");
          window.location.href = "/logout";
        });
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Basic Auth Routes - Shows BasicNavbar */}
        <Route element={<Guard />}>
          <Route path="/application" element={<Application />} />
        </Route>

        {/* Employee Routes - Shows EmployeeNavbar */}
        <Route element={<EmployeeGuard />}>
          <Route path="/personalprofile" element={<PersonalProfile />} />
          <Route path="/housing" element={<HousesPage />} />
          <Route path="/visa-status" element={<VisaManagement />} />
          <Route
            path="/facility-reports/:houseId"
            element={<FacilityReportsPage />}
          />
        </Route>

        {/* Public Routes - No Navbar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register/:token" element={<RegisterPage />} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* Default redirect */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

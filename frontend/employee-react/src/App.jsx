// import "./App.css";
// import { createBrowserRouter, RouterProvider } from "react-router";
// import Guard from "./components/Auth/AuthGuard";

// import Application from "./pages/Application/application.jsx";
// import PersonalProfile from "./pages/PersonalProfile/PersonalProfile.jsx";
// import LoginPage from "./pages/LoginPage/LoginPage.jsx";
// import RegisterPage from "./pages/RegisterPage/RegisterPage.jsx";
// import LogoutPage from "./pages/LogoutPage/LogoutPage.jsx";

// import Navbar from "./components/Navbar/Navbar.jsx";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Guard />,
//     children: [],
//   },
//   {
//     path: "/login",
//     element: <LoginPage />,
//     children: [],
//   },
//   {
//     path: "/register/:token",
//     element: <RegisterPage />,
//     children: [],
//   },
//   {
//     path: "/logout",
//     element: <LogoutPage />,
//     children: [],
//   },
//   {
//     path: "/application",
//     element: <Application />,
//   },
//   {
//     path: "/personalprofile",
//     element: <PersonalProfile />,
//   },
// ]);

// function App() {
//   return (
//     <>
//       <Navbar /> <RouterProvider router={router} />;
//     </>
//   );
// }

// export default App;

import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Guard from "./components/Auth/AuthGuard";

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
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Protected Route */}
        <Route path="/" element={<Guard />}>
          <Route path="application" element={<Application />} />
          <Route path="personalprofile" element={<PersonalProfile />} />
          <Route path="housing" element={<HousesPage />} />
          <Route path="/visa-status" element={<VisaManagement />} />
          <Route path="/facility-reports/:houseId" element={<FacilityReportsPage />} />
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

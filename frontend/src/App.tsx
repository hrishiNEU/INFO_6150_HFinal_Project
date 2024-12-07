import * as React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterAccountPage from "@pages/RegisterAccountPage";
import LandingPage from "./pages/LandingPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import CommunityAdminPage from "./pages/communityAdminPage";
import CommunityDetails from "./pages/CommunityDetails";
import AddCommunityPage from "@pages/AddCommunityPage";
import HomePage from "./pages/HomePage";
import ProfileSettings from "@pages/ProfileSettings";
import PrivateRoute from "./components/PrivateRoute";
import AuthLayout from "@layouts/AuthLayout";
import EventsPage from "@pages/EventsPage";
import CommunityUser from "@pages/CommunityUser";
import CreateEventPage from "@pages/CreateEventPage";
import EventsUser from "@pages/EventsUser";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterAccountPage />} />
        </Route>

        {/* Private Routes */}
        <Route path="/home" element={<PrivateRoute allowedRoles={["User"]} />}>
          <Route index element={<HomePage />} />
        </Route>

        <Route
          path="/profileSettings"
          element={
            <PrivateRoute
              allowedRoles={[
                "User",
                "CommunityAdmin",
                "BusinessOwner",
                "Admin",
              ]}
            />
          }
        >
          <Route index element={<ProfileSettings />} />
        </Route>

        <Route
          path="/admin-dashboard"
          element={<PrivateRoute allowedRoles={["Admin"]} />}
        >
          <Route index element={<AdminDashboardPage />} />
        </Route>

        <Route
          path="/communityAdminPage"
          element={<PrivateRoute allowedRoles={["CommunityAdmin"]} />}
        >
          <Route index element={<CommunityAdminPage />} />
          <Route path="community/:communityId" element={<CommunityDetails />} />
          <Route path="addCommunity" element={<AddCommunityPage />} />
        </Route>

        <Route
          path="/community-user"
          element={<PrivateRoute allowedRoles={["User"]} />}
        >
          <Route index element={<CommunityUser />} />
        </Route>
        <Route
          path="/event-user"
          element={<PrivateRoute allowedRoles={["User"]} />}
        >
          <Route index element={<EventsUser />} />
        </Route>

        <Route
          path="/create-event"
          element={<PrivateRoute allowedRoles={["BusinessOwner"]} />}
        >
          <Route index element={<CreateEventPage />} />
          <Route index element={<EventsPage />} />
        </Route>
        <Route
          path="/events"
          element={<PrivateRoute allowedRoles={["BusinessOwner"]} />}
        >
          <Route index element={<EventsPage />} />
        </Route>

        {/* Fallback for unauthorized access */}
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </Router>
  );
};

export default App;

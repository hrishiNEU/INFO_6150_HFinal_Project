import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "src/redux/store";

const AuthLayout = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth,
  );

  if (isAuthenticated && role === "Admin") {
    return <Navigate to="/admin-dashboard" />;
  }

  if (isAuthenticated && role === "BusinessOwner") {
    return <Navigate to="/events" />;
  }

  if (isAuthenticated && role === "CommunityAdmin") {
    return <Navigate to="/communityAdminPage" />;
  }

  if (isAuthenticated && role === "User") {
    return <Navigate to="/home" />;
  }

  return <Outlet />;
};

export default AuthLayout;

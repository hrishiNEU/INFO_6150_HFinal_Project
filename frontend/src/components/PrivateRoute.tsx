import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import NavigationSidebar from "./NavigationSidebar";

interface PrivateRouteProps {
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => state.auth,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/unauthorized" />;
  }

  // Render the nested routes (if any)
  return (
    <div className="flex h-[100vh] w-[100vw]">
      {/* Sidebar with a fixed width */}
      <div className="fixed left-0 top-0 h-full w-[50px] bg-slate-200 p-4 md:w-[75px]">
        <NavigationSidebar />
      </div>

      {/* Main content area with dynamic margin based on the sidebar width */}
      <div className="ml-[50px] w-full overflow-y-auto md:ml-[85px]">
        <Outlet />
      </div>
    </div>
  );
};

export default PrivateRoute;

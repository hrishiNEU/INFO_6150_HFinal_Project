import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  House,
  LogOut,
  LayoutDashboard,
  Users,
  SquarePlus,
  Calendar,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store";
import { logout } from "../redux/authSlice";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import { SERVER_PATHNAME } from "@utils/urls";

const NavigationSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileImage, name, role } = useSelector((state: any) => state.auth);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleProfileClick = () => {
    navigate("/profileSettings");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const profileImageURL = profileImage
    ? `${SERVER_PATHNAME}/${profileImage.replace(/\\/g, "/")}`
    : null;

  const routes = [
    //Coummunity admin navbar options
    {
      path: "/communityAdminPage",
      icon: <House />,
      roles: ["CommunityAdmin"],
    },
    {
      path: "/communityAdminPage/addCommunity",
      icon: <SquarePlus />,
      roles: ["CommunityAdmin"],
    },
    //User Navbar options
    {
      path: "/home",
      icon: <House />,
      roles: ["User"],
    },
    {
      path: "/community-user",
      icon: <Users />,
      roles: ["User"],
    },
    {
      path: "/event-user",
      icon: <Calendar />,
      roles: ["User"],
    },
    //BusinessOwner Navbar
    {
      path: "/events",
      icon: <House />,
      roles: ["BusinessOwner"],
    },
    {
      path: "/create-event",
      icon: <SquarePlus />,
      roles: ["BusinessOwner"],
    },
    {
      path: "/admin-dashboard",
      icon: <LayoutDashboard />,
      roles: ["Admin"],
    },
  ];

  const accessibleRoutes = routes.filter((route) =>
    route.roles.includes(role || ""),
  );

  const getInitials = () => {
    if (!name) return "";
    const names = name.split(" ");
    return names.map((n: any) => n[0].toUpperCase()).join("");
  };

  return (
    <div className="w-50 flex h-full flex-col items-center justify-between gap-4 bg-slate-200">
      {/* Navigation Links */}
      <div className="flex flex-col gap-4 p-4">
        {accessibleRoutes.map((route) => (
          <Link to={route.path} key={route.path}>
            <div
              className={`flex w-full cursor-pointer items-center justify-center rounded-md border border-slate-400 p-2 text-gray-800 shadow hover:bg-slate-400 ${
                location.pathname === route.path ? "bg-slate-400" : ""
              }`}
            >
              {route.icon}
            </div>
          </Link>
        ))}
      </div>
      {/* Profile Section */}
      <div className="flex flex-col items-center justify-end gap-4 p-4">
        <div className="flex flex-col items-center gap-2">
          <IconButton onClick={handleProfileClick}>
            <Tooltip title="Profile Settings">
              <Avatar
                alt={name || "User"}
                src={profileImageURL || undefined}
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: !profileImageURL ? "grey.500" : "transparent",
                  color: "white",
                  fontSize: "1rem",
                  overflow: "hidden", // Hide any overflow that might occur
                }}
              >
                {!profileImageURL && getInitials()}
                <img
                  src={profileImageURL || undefined}
                  alt={name || "User"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover", // Ensures the image covers the entire area of the Avatar
                  }}
                />
              </Avatar>
            </Tooltip>
          </IconButton>
        </div>
        {/* Logout Button */}
        <div
          className="flex cursor-pointer items-center justify-center rounded-md border border-slate-400 p-2 text-gray-800 shadow hover:bg-slate-400"
          onClick={handleOpenLogoutModal}
        >
          <Tooltip title="Log Out">
            <LogOut />
          </Tooltip>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <Dialog
        open={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
        aria-labelledby="logout-dialog-title"
      >
        <DialogTitle id="logout-dialog-title">
          Are you sure you want to log out?
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseLogoutModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="secondary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NavigationSidebar;

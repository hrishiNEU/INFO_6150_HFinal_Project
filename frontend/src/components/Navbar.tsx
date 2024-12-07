import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../redux/store"; // Adjust the import as necessary
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice"; // Import the logout action
import { User } from "lucide-react"; // Import the User icon from lucide-react
import "../styles/navbar.css"; // Assuming you have a CSS file for styling
import { SERVER_PATHNAME } from "@utils/urls";

const Navbar: React.FC = () => {
  const { profileImage, name } = useSelector((state: RootState) => state.auth);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const dispatch = useDispatch(); // Initialize useDispatch
  const navigate = useNavigate();

  const handleProfileClick = () => {
    setIsPopupOpen((prev) => !prev); // Toggle popup visibility
  };

  const handleLogout = () => {
    // Dispatch the logout action to reset the Redux state and sessionStorage
    dispatch(logout());
    // Navigate to the login page
    navigate("/login");
  };

  const handleProfileSettings = () => {
    // Navigate to profile settings page or show a modal if needed
    navigate("/profileSettings");
  };

  const profileImageURL = profileImage
  ? `${SERVER_PATHNAME}/${profileImage.replace(/\\/g, "/")}` // Replace backslashes with forward slashes
  : null;

  console.log("profileImageUrl",profileImageURL)

  return (
    <div className="navbar-container">
      <div className="navbar-left">
        <h1>HobbySpot</h1>
      </div>

      <div className="navbar-right">
        <div className="profile-container">
          {/* Displaying the profile icon if no profile image is available */}
          <div className="profile-image" onClick={handleProfileClick}>
            {profileImageURL ? (
              <img
                src={profileImageURL}
                alt={name || "User"}
                className="profile-image-img"
              />
            ) : (
              <User size={36} /> // Default icon when no profile image
            )}
          </div>

          {/* Popup Menu */}
          {isPopupOpen && (
            <div className="profile-popup">
              <ul>
                <li onClick={handleProfileSettings}>Profile Settings</li>
                <li onClick={handleLogout}>Logout</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

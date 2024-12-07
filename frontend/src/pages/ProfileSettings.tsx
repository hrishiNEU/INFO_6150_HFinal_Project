import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "../styles/profileSettings.css";
import Navbar from "../components/Navbar";
import { updateProfileImage } from "../redux/authSlice";
import { SERVER_PATHNAME } from "@utils/urls";

const ProfileSettings: React.FC = () => {
  const { profileImage, name, email, role, token } = useSelector(
    (state: any) => state.auth,
  );
  const dispatch = useDispatch();

  const [newProfileImage, setNewProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    profileImage
      ? `${SERVER_PATHNAME}/${profileImage}`
      : "/default-profile.png",
  );
  const [isEditingImage, setIsEditingImage] = useState(false); // Track if the user is editing the profile image
  const [isButtonVisible, setButtonVisible] = useState(false);

  useEffect(() => {
    const storedProfileImage = sessionStorage.getItem("profileImage");
    if (storedProfileImage) {
      setPreviewImage(`${SERVER_PATHNAME}/${storedProfileImage}`);
    }
  }, [profileImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewProfileImage(file);
      setButtonVisible(true);
    }
  };

  const clearFileInput = () => {
    setNewProfileImage(null);
    setButtonVisible(false);
    setIsEditingImage(false); // Hide the input again
  };

  const updateProfileImageInState = (newImageUrl: string) => {
    dispatch(updateProfileImage(newImageUrl));
    sessionStorage.setItem("profileImage", newImageUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    if (newProfileImage) {
      formData.append("profileImage", newProfileImage);
    }

    try {
      const response = await axios.post(
        `${SERVER_PATHNAME}/api/users/uploadProfile`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const newProfileImageUrl = response.data.user.profileImage;
      alert("Profile image updated successfully");
      updateProfileImageInState(newProfileImageUrl);

      setNewProfileImage(null);
      setButtonVisible(false); // Hide buttons after successful upload
      setIsEditingImage(false);
    } catch (err) {
      alert("Error updating profile image");
    }
  };

  return (
    <div className="profile-settings-container">
      <div className="settings-container">
        <div className="profile-image-section">
          <div className="profile-image-circle">
            <img
              src={previewImage || "/default-profile.png"}
              alt="Profile"
              className="profile-image-img"
            />
            <div className="edit-icon">
              <label
                htmlFor="profileImage"
                className="edit-btn"
                onClick={() => setIsEditingImage(true)}
              >
                ✏️
              </label>
            </div>
          </div>
          {isEditingImage && (
            <form onSubmit={handleSubmit} className="upload-form">
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
                disabled={!isEditingImage}
              />
              <div className="buttons-section">
                {isButtonVisible && (
                  <>
                    <button type="submit" className="settings-btn submit-btn">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      className="settings-btn cancel-btn"
                      onClick={clearFileInput}
                    >
                      Cancel Changes
                    </button>
                  </>
                )}
              </div>
            </form>
          )}
        </div>

        <div className="user-info-section">
          <div className="info-item">
            <label>Name:</label>
            <input type="text" value={name} readOnly className="info-input" />
          </div>
          <div className="info-item">
            <label>Email:</label>
            <input type="email" value={email} readOnly className="info-input" />
          </div>
          <div className="info-item">
            <label>Role:</label>
            <input type="text" value={role} readOnly className="info-input" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
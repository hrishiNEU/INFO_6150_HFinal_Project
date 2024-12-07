import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import axios from "axios"; // Import Axios
import loginImage from "../images/loginImage.png";
import "../styles/login.css";
import "../styles/register.css";
import { SERVER_PATHNAME } from "@utils/urls";

const RegisterAccountPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("User");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [apiError, setApiError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;
  const nameRegex = /^[A-Za-z]+$/; // Only letters allowed for first and last name

  // Validation for email
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError("Enter a valid email");
    } else {
      setEmailError("");
    }
  };

  // Validation for first name
  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFirstName(value);

    if (!nameRegex.test(value)) {
      setFirstNameError("First name must only contain letters");
    } else {
      setFirstNameError("");
    }
  };

  // Validation for last name
  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLastName(value);

    if (!nameRegex.test(value)) {
      setLastNameError("Last name must only contain letters");
    } else {
      setLastNameError("");
    }
  };

  // Validation for password
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (value.length < 8) {
      setPasswordError("Password must be at least 8 characters");
    } else {
      setPasswordError("");
    }
  };

  // Validation for confirm password
  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (value !== password) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError("");
    }
  };

  // Submit handler using Axios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${SERVER_PATHNAME}/api/users/register`,
        {
          name: `${firstName} ${lastName}`,
          email,
          password,
          role,
        },
      );

      const data = response.data;
      dispatch(
        login({
          id: data._id,
          name: data.name,
          role: data.role,
          token: data.token,
          email: data.email,
          profileImage: data.profileImage,
        }),
      );

      // Redirect based on role
      switch (data.role) {
        case "Admin":
          navigate("/admin-dashboard");
          break;
        case "User":
          navigate("/home");
          break;
        case "CommunityAdmin":
          navigate("/communityAdminPage");
          break;
        case "BusinessOwner":
          navigate("/events");
          break;
        default:
          navigate("/unauthorized");
      }
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Registration failed");
    }
  };

  // Check if the form is valid (no error messages)
  const isFormValid =
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    !firstNameError &&
    !lastNameError;

  return (
    <div className="login-container">
      {/* Background SVG */}
      <svg
        className="svg-background"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 320"
      >
        <path
          fill="#78c2ad"
          fillOpacity="1"
          d="M0,160L48,144C96,128,192,96,288,101.3C384,107,480,149,576,181.3C672,213,768,235,864,224C960,213,1056,171,1152,149.3C1248,128,1344,128,1392,128L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

      {/* Content Wrapper */}
      <div className="content-wrapper">
        {/* Left Side: Register Form */}
        <div className="form-left">
          <h1 className="login-title">Register to HobbySpot!</h1>
          <p className="login-subtitle">Create your account to explore!</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="name-container">
              <div className="name-input">
                <label htmlFor="firstName" className="input-label">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="input-field"
                  value={firstName}
                  onChange={handleFirstNameChange}
                  required
                />
              </div>
              <div className="name-input">
                <label htmlFor="lastName" className="input-label">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="input-field"
                  value={lastName}
                  onChange={handleLastNameChange}
                  required
                />
              </div>
            </div>
            {firstNameError && <p className="error-text">{firstNameError}</p>}
            {lastNameError && <p className="error-text">{lastNameError}</p>}

            <label htmlFor="email" className="input-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={handleEmailChange}
              required
            />
            {emailError && <p className="error-text">{emailError}</p>}

            <label htmlFor="password" className="input-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            {passwordError && <p className="error-text">{passwordError}</p>}

            <label htmlFor="confirmPassword" className="input-label">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
            {confirmPasswordError && (
              <p className="error-text">{confirmPasswordError}</p>
            )}

            <label htmlFor="role" className="input-label">
              Role
            </label>
            <select
              id="role"
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="Admin">Admin</option>
              <option value="User">User</option>
              <option value="CommunityAdmin">Community Admin</option>
              <option value="BusinessOwner">Business Owner</option>
            </select>

            <button
              type="submit"
              className="submit-btn"
              disabled={!isFormValid}
            >
              Register to Explore!
            </button>
            {apiError && <p className="error-text">{apiError}</p>}
          </form>

          <p className="register-text">
            Already have an account?{" "}
            <span className="register-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="form-right">
          <img src={loginImage} alt="Register Image" className="form-image" />
        </div>
      </div>
    </div>
  );
};

export default RegisterAccountPage;

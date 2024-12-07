import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../redux/authSlice";
import axios from "axios"; // Import Axios
import loginImage from "../images/loginImage.png";
import "../styles/login.css"; // Import external CSS
import { SERVER_PATHNAME } from "@utils/urls";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [apiError, setApiError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRegex = /^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}$/;

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (!emailRegex.test(value)) {
      setEmailError("Enter a valid email");
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${SERVER_PATHNAME}/api/users/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      const data = response.data;
      console.log({ data });
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
      setApiError(error.response?.data?.message || "Login failed");
    }
  };

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
        {/* Left Side: Login Form */}
        <div className="form-left">
          <h1 className="login-title">Welcome to HobbySpot!</h1>
          <p className="login-subtitle">Login to Explore!</p>

          <form className="login-form" onSubmit={handleSubmit}>
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
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="submit-btn">
              Login to Explore!
            </button>
            {apiError && <p className="error-text">{apiError}</p>}
          </form>

          <p className="register-text">
            Don't have an account?{" "}
            <span
              className="register-link"
              onClick={() => navigate("/register")}
            >
              Create one
            </span>
          </p>
        </div>

        {/* Right Side: Image */}
        <div className="form-right">
          <img src={loginImage} alt="Login visual" className="login-image" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

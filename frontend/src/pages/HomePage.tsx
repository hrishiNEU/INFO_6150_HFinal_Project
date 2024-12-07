import React from "react";
import { useNavigate } from "react-router-dom";
import BannerBackground from "../images/home-banner-background.png";
import BannerImage from "../images/home-banner-image.png";
import { ChevronRight } from "lucide-react";
import About from "../components/About";
import Work from "../components/Work";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";
import "../styles/styling.css";
import "../styles/styling.css";

const HomePage: React.FC = () => {
  // const { name, email } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/community-user");
  };

  return (
    <div className="landing-home-container">
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <br />
          <br />
          <h1 className="primary-heading">
            Join hands with the People that Share your Hobbies
          </h1>
          <p className="primary-text">
            Sign-in to interact with a community of fellow hobbyists and an
            eco-system of experts, teachers, suppliers, classes, workshops, and
            places to practice, participate or perform
          </p>
          <button className="secondary-button" onClick={handleNavigate}>
            Communities <ChevronRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
      <About />
      <Work />
      <Testimonial />
      <Footer />
    </div>
  );
};

export default HomePage;

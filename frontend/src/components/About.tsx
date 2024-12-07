import AboutBackground from "../images/about-background.png";
import AboutBackgroundImage from "../images/about-background-image.png";
import { Play } from "lucide-react";

const About = () => {
  return (
    <div id="about" className="about-section-container">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="about-section-image-container">
        <img src={AboutBackgroundImage} alt="" />
      </div>
      <div className="about-section-text-container">
        <p className="primary-subheading">About</p>
        <h1 className="primary-heading">
          You never lose a dream, it just incubates as a Hobby
        </h1>
        <p className="primary-text">
          Hobbies play a crucial role in mental well-being by reducing stress
          and promoting relaxation through engaging, enjoyable activities.
          Scientifically, they stimulate the brain, enhancing cognitive function
          and creativity while lowering anxiety levels.
        </p>
        <p className="primary-text">
          Engaging in hobbies also boosts happiness by releasing dopamine, the
          "feel-good" neurotransmitter, fostering a sense of accomplishment and
          satisfaction.
        </p>
        <div className="about-buttons-container">
          <a
            target="_blank"
            href="https://www.self.com/story/hobbies-health-benefits"
          >
            <button className="secondary-button">Learn More</button>
          </a>
          <a
            target="_blank"
            href="https://youtu.be/WUu69S5KHXQ?si=I1a_1_KJP8Oac_h-"
          >
            <button className="watch-video-button">
              <Play /> Watch Video
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About;
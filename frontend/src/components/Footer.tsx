import { Twitter } from "lucide-react";
import { Linkedin } from "lucide-react";
import { Youtube } from "lucide-react";
import { Facebook } from "lucide-react";

const Footer = () => {
  return (
    <div className="footer-wrapper">
      <div className="footer-section-one">
        <div className="footer-icons">
          <Twitter />
          <Linkedin />
          <Youtube />
          <Facebook />
        </div>
      </div>
      <div className="footer-section-two">
        <div className="footer-section-columns">
          <span>Share</span>
          <span>Carrers</span>
          <span>Work</span>
          <span>Testimonials</span>
        </div>
        <div className="footer-section-columns">
          <span>244-5333-7783</span>
          <span>Boston</span>
          <span>New York</span>
          <span>San Jose</span>
        </div>
        <div className="footer-section-columns">
          <span>Terms & Conditions</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
};

export default Footer;
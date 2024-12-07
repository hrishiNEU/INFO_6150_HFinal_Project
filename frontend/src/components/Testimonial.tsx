import ProfilePic from "../images/john-doe-image.png";
import ProfilePic2 from "../images/jane-smith-image.png";
import ProfilePic3 from "../images/michael-johnson-image.png";
import { Star, StarHalf } from "lucide-react";
import { useState } from "react";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    text: "This website provides a fantastic platform for connecting like-minded individuals with shared hobbies and interests, making it easy to find and engage with communities.",
    image: ProfilePic,
  },
  {
    id: 2,
    name: "Jane Smith",
    text: "The user-friendly interface and tailored content recommendations make exploring new hobbies and meeting people with similar passions a seamless experience.",
    image: ProfilePic2,
  },
  {
    id: 3,
    name: "Michael Johnson",
    text: "Whether you're into crafting, gaming, or sports, this website is a vibrant hub for discovering and building meaningful connections based on your hobbies.",
    image: ProfilePic3,
  },
  // Add more testimonials as needed
];

const Testimonial = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + testimonials.length) % testimonials.length,
    );
  };

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div id="testimonials" className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Testimonials</p>
        <h1 className="primary-heading">What are they Saying</h1>
        <p className="primary-text">
          Hear firsthand from our users as they share their experiences of
          discovering new interests, building lasting relationships, and growing
          within a supportive, like-minded community.
        </p>
      </div>

      <div className="testimonial-section-bottom">
        <div className="carousel-container">
          <button className="carousel-prev" onClick={handlePrev}>
            &#10094;
          </button>
          <button className="carousel-next" onClick={handleNext}>
            &#10095;
          </button>
          <div className="testimonial-slide">
            <img
              className="testimonial-img"
              src={currentTestimonial.image}
              alt={currentTestimonial.name}
            />
            <p>{currentTestimonial.text}</p>
            <div className="testimonials-stars-container">
              <Star />
              <Star />
              <Star />
              <Star />
              <StarHalf />
            </div>
            <h2>{currentTestimonial.name}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;

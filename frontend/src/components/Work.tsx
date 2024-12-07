import PickMeals from "../images/pick-meals-image.png";
import ChooseMeals from "../images/choose-image.png";
import DeliveryMeals from "../images/delivery-image.png";

const Work = () => {
  const workInfoData = [
    {
      image: PickMeals,
      title: "Pottery",
      text: "A community of pottery enthusiasts, bonded by a passion for crafting unique pieces and celebrating the art of working with clay",
    },
    {
      image: ChooseMeals,
      title: "Music",
      text: "A community of music lovers, united by a shared passion for creating, sharing, and enjoying the universal language of melody and rhythm",
    },
    {
      image: DeliveryMeals,
      title: "Hiking",
      text: "A community of hiking enthusiasts, united by a love for exploring nature, challenging themselves, and sharing the beauty of the great outdoors",
    },
  ];
  return (
    <div id="work" className="work-section-wrapper">
      <div className="work-section-top">
        <p className="primary-subheading">Join</p>
        <h1 className="primary-heading">Our Most Popular Communities</h1>
        <p className="primary-text">
          Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
          elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
        </p>
      </div>
      <div className="work-section-bottom">
        {workInfoData.map((data) => (
          <div className="work-section-info" key={data.title}>
            <div className="info-boxes-img-container">
              <img src={data.image} alt="" />
            </div>
            <h2>{data.title}</h2>
            <p>{data.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Work;
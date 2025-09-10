// HomePage.jsx
import { Link } from "react-router-dom";
import "../styles/home.css";

const HomePage = () => {
  return (
    <section className="homepage">
      <div className="homepage__container">
        <div className="homepage__content">
          <h4 className="homepage__subtitle">NEW PRODUCTS</h4>
          <h1 className="homepage__title">XX99 MARK II HEADPHONES</h1>
          <p className="homepage__text">
            Experience natural, lifelike audio and exceptional build quality
            made for the passionate music enthusiast.
          </p>
          <Link to="/products" className="homepage__button">
            SEE PRODUCTS
          </Link>
        </div>
        <div className="homepage__image-wrapper">
          <img
            className="homepage__image"
            src="Bitmap.png"
            alt="XX99 Mark II headphones"
          />
        </div>
      </div>
    </section>
  );
};

export default HomePage;

import { Link } from "react-router-dom";
import "../styles/home.css";

const HomePage = () => {
  return (
    <section className="homepage">
      <div className="homepage__container">
        <div className="homepage__content">
          <h4 className="homepage__subtitle">NEW PRODUCTS</h4>
          <h1 className="homepage__title">MUNIR'S ELECTRONICS</h1>
          <p className="homepage__text">
            Munirs Electronics is your all-in-one destination for quality
            electronics. We're a dedicated team of tech enthusiasts and product
            specialists committed to helping you get the most out of the latest
            electronic products.
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

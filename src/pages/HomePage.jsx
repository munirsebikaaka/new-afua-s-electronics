import { Link } from "react-router-dom";
import "../styles/home.css";

const HomePage = () => {
  return (
    <section class="section1">
      <div class="main">
        <div>
          <h4>NEW PRODUCTS</h4>
          <h1>XX99 MARK II HEADPHONES</h1>
          <p>
            Experience natural, lifelike audio and exceptional build quality
            made for the passionate music enthusiast.
          </p>
          <Link to={"/products"} className="head-products">
            SEE PRODUCTS
          </Link>
        </div>
        <img
          className="hero-img"
          src="Bitmap.png"
          alt="example of bart sound"
        />
      </div>
    </section>
  );
};
export default HomePage;

import { MdOutlineShoppingCart } from "react-icons/md";
import "./styles/nav.css";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="app-nav-cell">
      <nav className="app-nav">
        <div className="menu">
          <h1>
            <strong>MUNIR'S ELECTRONICS</strong>
          </h1>
        </div>
        <ul className="hide-links">
          <li>
            <Link to={"/"} className="nav-link active">
              HOME
            </Link>
          </li>
          <li>
            <Link className="nav-link" to={"products"}>
              PRODUCTS
            </Link>
          </li>
          <li>
            <Link className="nav-link" to={"cart"}>
              CART
            </Link>
          </li>
          <li>
            <Link className="nav-link" to={"admin"}>
              ADIMIL PANEL
            </Link>
          </li>
          <li>
            <Link className="nav-link" to={"details"}>
              product setails
            </Link>
          </li>
        </ul>
        <MdOutlineShoppingCart />
      </nav>
    </div>
  );
};

export default Navbar;

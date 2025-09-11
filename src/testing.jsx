import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineShoppingCart } from "react-icons/md";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import "./styles/nav.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="navbar-container">
      <nav className="navbar">
        <div className="navbar-logo">
          <h1>MUN'S ELECTRONICS</h1>
        </div>

        <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
          <li>
            <Link to="/" onClick={() => setIsOpen(false)}>
              HOME
            </Link>
          </li>
          <li>
            <Link to="/products" onClick={() => setIsOpen(false)}>
              PRODUCTS
            </Link>
          </li>
          <li>
            <Link to="/cart" onClick={() => setIsOpen(false)}>
              CART
            </Link>
          </li>
          <li>
            <Link to="/admin" onClick={() => setIsOpen(false)}>
              ADMIN PANEL
            </Link>
          </li>
          <li>
            <Link to="/details" onClick={() => setIsOpen(false)}>
              PRODUCT DETAILS
            </Link>
          </li>

          <li>
            <Link to={"/cart"} onClick={() => setIsOpen(false)}>
              <MdOutlineShoppingCart className="cart-icon" />
            </Link>
          </li>
        </ul>

        <div className="navbar-icons">
          <button
            className="navbar-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu">
            {isOpen ? <HiX /> : <HiMenuAlt3 />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

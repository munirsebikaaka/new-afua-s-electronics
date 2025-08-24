// =============================================
// NAVIGATION

import { useCart } from "../App";
import { Link } from "react-router-dom";

// =============================================
const Navbar = () => {
  const { cart } = useCart();

  return (
    <nav className="navbar">
      <Link to="/">Home</Link> | <Link to="/products">Products</Link> |{" "}
      <Link to="/cart">Cart ({cart.length})</Link> |{" "}
      <Link to="/checkout">Checkout</Link> | <Link to="/admin">Admin</Link>
    </nav>
  );
};

export default Navbar;

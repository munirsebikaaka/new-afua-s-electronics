import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminPage from "./pages/AdminPage";
import { CartProvider } from "./context/CartContext";
import Navbar from "./testing";
import ProductDetails from "./components/productDetails";

const App = () => (
  <Router>
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        {/* 👆 Dynamic route for single product */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </CartProvider>
  </Router>
);

export default App;

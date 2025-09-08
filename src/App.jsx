import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import AdminPage from "./pages/AdminPage";
// import Navbar from "./components/Navbar";
import { CartProvider } from "./context/CartContext";
import ProductListPage from "./pages/ProductListPage";
import ProductList from "./pages/ProductListPage";
import Navbar from "./testing";
import ProductDetails from "./components/productDetails";

const App = () => (
  <Router>
    <CartProvider>
      {/* <Navbar /> */}
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/details" element={<ProductDetails />} />
      </Routes>
    </CartProvider>
  </Router>
);

export default App;

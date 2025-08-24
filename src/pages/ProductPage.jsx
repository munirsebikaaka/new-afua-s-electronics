// =============================================
// PRODUCTS PAGE

import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";
import { useCart } from "../App";

// =============================================
const ProductsPage = () => {
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error(error);
      else setProducts(data);
    };
    loadProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {products.map((p) => (
          <li key={p.id}>
            <img src={p.image_url} alt={p.name} width="50" />
            {p.name} - ${p.price}
            <button onClick={() => addToCart(p)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default ProductsPage;

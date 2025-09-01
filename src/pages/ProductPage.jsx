import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";
import { useCart } from "../context/CartContext";

const ProductsPage = () => {
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error("Error loading products:", error.message);
      else setProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  return (
    <div>
      <h2>Products</h2>
      <div>
        {isLoading ? (
          <p>loading...</p>
        ) : products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((p) => (
            <div key={p.id}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} />
              ) : (
                <div>No Image</div>
              )}

              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <button onClick={() => addToCart(p)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

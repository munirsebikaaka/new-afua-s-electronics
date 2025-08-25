import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";
import { useCart } from "../App";

const ProductsPage = () => {
  const { cart, setCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) console.error("Error loading products:", error.message);
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}>
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                textAlign: "center",
              }}>
              {/* Show product image if available */}
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    background: "#f0f0f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    borderRadius: "6px",
                  }}>
                  No Image
                </div>
              )}

              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <button
                onClick={() => addToCart(p)}
                style={{
                  marginTop: "10px",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  border: "none",
                  background: "#0070f3",
                  color: "white",
                  cursor: "pointer",
                }}>
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

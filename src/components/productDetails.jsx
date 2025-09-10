import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import supabase from "../supabase/supabaseClient";
import { useCart } from "../context/CartContext";
import "../styles/productDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const { cart, setCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const phoneNumber = "256742083075";

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error loading product:", error.message);
      } else {
        setProduct(data);

        if (data?.category) {
          const { data: related, error: relatedError } = await supabase
            .from("products")
            .select("*")
            .eq("category", data.category)
            .neq("id", id)
            .limit(4);

          if (relatedError) {
            console.error(
              "Error loading related products:",
              relatedError.message
            );
          } else {
            setRelatedProducts(related);
          }
        }
      }
      setIsLoading(false);
    };

    loadProduct();
  }, [id]);

  const addToCart = () => {
    if (product) {
      setCart([...cart, product]);
    }
  };

  const handleSendMessage = () => {
    if (product) {
      const message = `Hello, I'm interested in "${product.name}" priced at $${product.price}. Could you tell me more?`;
      const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");
    }
  };

  if (isLoading) {
    return <p className="loading-text">Loading product...</p>;
  }

  if (!product) {
    return <p className="loading-text">No product found.</p>;
  }

  return (
    <div className="product-page">
      <div className="goback">
        <Link className="link" to="/products">
          ← Go Back
        </Link>
      </div>

      <div className="product-section">
        <div className="img-container">
          <img
            src={product.image_url || "img.jpeg"}
            className="product-image"
            alt={product.name}
          />
        </div>

        <div className="about">
          <h4 className="new-label">NEW PRODUCTS</h4>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-description">{product.description}</p>
          <h2 className="product-price">${product.price}</h2>

          <div className="btn-group">
            <button onClick={addToCart} className="btn add-to-cart">
              Add to Cart
            </button>
            <button onClick={handleSendMessage} className="btn outline-btn">
              Send a Message
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2 className="related-title">Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map((rp) => (
              <div key={rp.id} className="related-card">
                <Link to={`/products/${rp.id}`}>
                  <img
                    src={rp.image_url || "img.jpeg"}
                    alt={rp.name}
                    className="related-img"
                  />
                  <h3 className="related-name">{rp.name}</h3>
                  <p className="related-price">${rp.price}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

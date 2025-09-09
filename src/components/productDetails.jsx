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

  const phoneNumber = "256742083075"; // Your WhatsApp number in international format

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
    return <p>Loading product...</p>;
  }

  if (!product) {
    return <p>No product found.</p>;
  }

  return (
    <div>
      <div className="goback">
        <Link className="link" to="/products">
          Go Back
        </Link>
      </div>

      <div className="product-section-alone">
        <div className="img-container">
          <img
            src={product.image_url || "img.jpeg"}
            className="product-image-alone"
            alt={product.name}
          />
        </div>

        <div className="about">
          <h4>NEW PRODUCTS</h4>
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <h2>${product.price}</h2>

          <div className="dets-btns">
            <button onClick={addToCart} className="add-to-cart-btn">
              Add to Cart
            </button>

            <button onClick={handleSendMessage} className="head-products">
              Send a Message
            </button>
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="related-section">
          <h2>Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map((rp) => (
              <div key={rp.id} className="related-card">
                <Link to={`/products/${rp.id}`}>
                  <img
                    src={rp.image_url || "img.jpeg"}
                    alt={rp.name}
                    className="related-img"
                  />
                  <h3>{rp.name}</h3>
                  <p>${rp.price}</p>
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

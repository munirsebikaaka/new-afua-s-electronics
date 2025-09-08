import { useEffect, useState } from "react";
import supabase from "../supabase/supabaseClient";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { cart, setCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("products").select("*");
      console.log(data);
    };
    loadProducts();
  }, []);
  return (
    <div className="product-section-alone">
      <div className="img-container">
        <img
          src="img.jpeg"
          className="product-image-alone"
          alt="headphone barts"
        />
      </div>
      <div className="about">
        <h4>NEW PRODUCTS</h4>
        <h1>
          XX99 MARK II
          <br />
          <span> HEADPHONES</span>
        </h1>
        <p>
          The new XX99 Mark II headphones is the pinnacle of pristine audio. It
          redefines your premium headphone experience by reproducing the
          balanced depth and precision of studio-quality sound.
        </p>
        <a className="head-products" href="/detailsOne">
          SEE PRODUCTS
        </a>
      </div>
    </div>
  );
};

export default ProductDetails;

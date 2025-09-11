import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../supabase/supabaseClient";
import "../styles/products.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      let query = supabase.from("products").select("*", { count: "exact" });

      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      query = query.order("price", { ascending: sort === "asc" });

      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error loading products:", error.message);
        setProducts([]);
      } else {
        setProducts(data || []);
        if (count !== null) {
          setTotalPages(Math.ceil(count / limit));
        }
      }

      setIsLoading(false);
    };

    loadProducts();
  }, [search, sort, page]);

  return (
    <div className="products-container">
      <div className="products-hero">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          src="tests.mp4"
        />
        <div className="hero-content">
          <h1>Welcome to Munir's Electronics</h1>
          <p>Your one-stop shop for the latest electronics and gadgets.</p>
          <p>
            At Munirs Electronics, we bring you a wide range of reliable
            products designed to make everyday life easier. From high-quality
            refrigerators, televisions, and all other
            <strong>
              <em>Electronics</em>
            </strong>
            you have ever imagined of. Our collection is carefully selected to
            combine performance, durability, and affordability — ensuring you
            always get the best value.
          </p>
        </div>
      </div>

      <h2 className="products-title">Products</h2>

      <div className="products-filters">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="asc">Price: Low → High</option>
          <option value="desc">Price: High → Low</option>
        </select>
      </div>

      {isLoading ? (
        <p className="loading-text">Loading...</p>
      ) : products.length === 0 ? (
        <p className="loading-text">No products found.</p>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => navigate(`/products/${p.id}`)}>
              {p.image_url ? (
                <img src={p.image_url} alt={p.name} className="product-img" />
              ) : (
                <div className="product-placeholder">No Image</div>
              )}

              <h3 className="product-name">{p.name}</h3>
              <p className="product-price">${p.price}</p>
              <button className="product-btn">View Details</button>
            </div>
          ))}
        </div>
      )}

      <div className="products-pagination">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}>
          ⬅ Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}>
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default ProductsPage;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // for navigation
import supabase from "../supabase/supabaseClient";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("asc");

  // pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20; // ✅ show 20 products per page

  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      let query = supabase.from("products").select("*", { count: "exact" });

      // search
      if (search) {
        query = query.ilike("name", `%${search}%`);
      }

      // sort
      query = query.order("price", { ascending: sort === "asc" });

      // pagination
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
    <div>
      <h2>Products</h2>

      {/* filters */}
      <div style={{ marginBottom: "20px" }}>
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

      {/* product list */}
      {isLoading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "15px",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          }}>
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/products/${p.id}`)} // ✅ go to details
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px",
                textAlign: "center",
                cursor: "pointer",
              }}>
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  style={{
                    width: "100%",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    marginBottom: "8px",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "150px",
                    background: "#eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}>
                  No Image
                </div>
              )}

              <h3>{p.name}</h3>
              <p>${p.price}</p>
              <button className="head-products">View Details</button>
            </div>
          ))}
        </div>
      )}

      {/* pagination */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "12px",
        }}>
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
